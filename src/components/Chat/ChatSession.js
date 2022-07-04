// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import "amazon-connect-chatjs";
import { CONTACT_STATUS } from "../../constants/global";
import { modelUtils } from "./datamodel/Utils";
import {
  ContentType,
  PARTICIPANT_MESSAGE,
  Direction,
  Status,
  ATTACHMENT_MESSAGE,
  AttachmentErrorType,
  PARTICIPANT_TYPES
} from "./datamodel/Model";


const SYSTEM_EVENTS = Object.values(ContentType.EVENT_CONTENT_TYPE);

// Low-level abstraction on top of Chat.JS
class ChatJSClient {
  session = null;

  constructor(chatDetails,region, stage) {
    // Creating a chatSession object with Chat.JS
    // Other operations (connecting, sending message, ...) are then done by interacting
    // with the chatSession object (this.session)
    this.session = connect.ChatSession.create({
      chatDetails: chatDetails.startChatResult,
      type: "CUSTOMER",
      options: {region: region}
    });
  }

  connect() {
    // Intiate the websocket connection. After the connection is established, the customer's chat request
    // will be routed to an agent who can then accept the request.
    return this.session.connect();
  }

  disconnect() {
    return this.session.disconnectParticipant();
  }

  onTyping(handler) {
    return this.session.onTyping(handler);
  }

  onEnded(handler) {
    return this.session.onEnded(handler);
  }

  onMessage(handler) {
    return this.session.onMessage(handler);
  }

  onConnectionEstablished(handler) {
    return this.session.onConnectionEstablished(handler);
  }

  onConnectionBroken(handler) {
    return this.session.onConnectionBroken(handler);
  }

  getContactId() {
    return this.session.controller.contactId;
  }

  getParticipantId() {
    return this.session.getChatDetails().participantId;
  }

  getTranscript(args) {
    return this.session.getTranscript(args);
  }

  sendTypingEvent() {
    return this.session.sendEvent({
      contentType: ContentType.EVENT_CONTENT_TYPE.TYPING
    });
  }

  sendMessage(content) {
    // Right now we are assuming only text messages,
    // later we will have to add functionality for other types.
    return this.session.sendMessage({
      message: content.data,
      contentType: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN
    });
  }

  sendAttachment(attachment) {
    return this.session.sendAttachment({ attachment });
  }
 
  downloadAttachment(attachmentId){
    return this.session.downloadAttachment({ attachmentId });
  }
}


class ChatSession {

  transcript = [];
  typingParticipants = [];
  thisParticipant = null;
  client = null;
  contactId = null;
  contactStatus = CONTACT_STATUS.DISCONNECTED;

  /**
   * Flag set when an outgoing message from the Customer is in flight.
   * Until the request completes, we will not render a Customer message over the websocket.
   *
   * @type {boolean}
   */
  isOutgoingMessageInFlight = false;

  _eventHandlers = {
    'transcript-changed': [],
    'typing-participants-changed': [],
    'contact-status-changed': [],
    'incoming-message': [],
    'outgoing-message': [],
    'chat-disconnected': [],
    'chat-closed': [],
  };

  constructor(chatDetails, displayName, region, stage) {
    this.client = new ChatJSClient(chatDetails, region, stage);
    this.contactId = this.client.getContactId();
    this.thisParticipant = {
      participantId: this.client.getParticipantId(),
      displayName: displayName
    };
    if(window.connect && window.connect.LogManager) {
      this.logger = window.connect.LogManager.getLogger({ prefix: "ChatInterface-ChatSession" });
    }
  }

  // Callbacks 
  onChatDisconnected(callback){
    this.on("chat-disconnected", function(...rest){
      callback(...rest);
    })
  }

  onChatClose(callback){
    this.on("chat-closed", function(...rest){
      callback(...rest);
    })
  }
  
  onIncoming(callback){
    this.on("incoming-message", function(...rest){
      callback(...rest);
    })
  }

  onOutgoing(callback){
    this.on("outgoing-message", function(...rest){
      callback(...rest);
    })
  }

  // Decoratorers 
  incomingItemDecorator(item){
    return item;
  }

  outgoingItemDecorator(item){
    return item;
  }

  // CHAT API
  openChatSession() {
    this._addEventListeners();
    this._updateContactStatus(CONTACT_STATUS.CONNECTING);
    return this.client.connect().then((response) => {
      this._updateContactStatus(CONTACT_STATUS.CONNECTED);
      return response;
    }, (error) => {
      this._updateContactStatus(CONTACT_STATUS.DISCONNECTED);
      return Promise.reject(error);
    });
  }

  async endChat() {
    await this.client.disconnect();
    this._updateContactStatus(CONTACT_STATUS.DISCONNECTED);
    this._triggerEvent("chat-disconnected");
    this._triggerEvent("chat-closed");
  }

  closeChat() {
    this._triggerEvent("chat-closed");
  }

  sendTypingEvent() {
    this.logger && this.logger.info("Calling SendEvent API for Typing");
    return this.client.sendTypingEvent();
  }

  addOutgoingMessage(data) {
    const message = modelUtils.createOutgoingTranscriptItem(
      PARTICIPANT_MESSAGE,
    { data: data.text, type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN },
      this.thisParticipant
    );
    this.logger && this.logger.info(`Adding outgoing message. ContactId: ${this.contactId}`);

    this._addItemsToTranscript([message]);

    this.isOutgoingMessageInFlight = true;

    this.client
      .sendMessage(message.content)
      .then((response) => {
        console.log("send success");
        console.log(response);
        this._replaceItemInTranscript(
          message,
          modelUtils.createTranscriptItemFromSuccessResponse(
            message,
            response
          )
        );

        this.isOutgoingMessageInFlight = false;
        return response;
      })
      .catch((error) => {
        this.isOutgoingMessageInFlight = false;

        this._failMessage(message);
      });
  }

  addOutgoingAttachment(attachment) {
    const transcriptItem = modelUtils.createOutgoingTranscriptItem(
        ATTACHMENT_MESSAGE,
        attachment,
        this.thisParticipant
    );
    this._addItemsToTranscript([transcriptItem]);
    this.logger && this.logger.info(`Sending File. ContactId: ${this.contactId}.`);
    return this.sendAttachment(transcriptItem);
  }
 
  sendAttachment(transcriptItem) {
    const {participantId, displayName} = this.thisParticipant;
    return this.client
        .sendAttachment(transcriptItem.content)
        .then(response => {
          console.log("RESPONSE", response);
          console.log("sendAttachment response:", response);
          this.transcript.splice(this.transcript.indexOf(transcriptItem), 1);
          return response;
        }).catch(error => {
          transcriptItem.transportDetails.error = {
            type: error.type,
            message: error.message,
          };

          if (error.type !== AttachmentErrorType.ValidationException) {
            if (error.type === AttachmentErrorType.ServiceQuotaExceededException) {
              transcriptItem.transportDetails.error.message = "Attachment failed to send. The maximum number of attachments allowed, has been reached";
            } else {
              transcriptItem.transportDetails.error.message = "Attachment failed to send";
              transcriptItem.transportDetails.error.retry = () => {
                const newTranscriptItem = modelUtils.createOutgoingTranscriptItem(
                    ATTACHMENT_MESSAGE,
                    transcriptItem.content,
                    { displayName, participantId }
                );
                newTranscriptItem.id = transcriptItem.id;
                this._replaceItemInTranscript(transcriptItem, newTranscriptItem);
                this.sendAttachment(newTranscriptItem);
              }
            }
          }

          this._failMessage(transcriptItem);
        });
  }
 
  downloadAttachment(attachmentId) {
    return this.client.downloadAttachment(attachmentId)
  }

  loadPreviousTranscript() {
    console.log("loadPreviousTranscript in single");
    var args = {};
    if (this.transcript.length > 0) {
      args.startPosition = {};
      args.startPosition.id = this.transcript[0].id;
    }
    args.scanDirection = "BACKWARD";
    args.sortOrder = "ASCENDING";
    args.maxResults = 15;
    return this._loadTranscript(args);
  }

  // EVENT HANDLING
  
  on(eventType, handler) {
    this.logger && this.logger.info(`Event [${eventType}] is on!`);
    if (this._eventHandlers[eventType].indexOf(handler) === -1) {
      this._eventHandlers[eventType].push(handler);
    }
  }

  off(eventType, handler) {
    this.logger && this.logger.info(`Event [${eventType}] is off!`);
    const idx = this._eventHandlers[eventType].indexOf(handler);
    if (idx > -1) {
      this._eventHandlers[eventType].splice(idx, 1);
    }
  }

  _triggerEvent(eventType, payload) {
    this.logger && this.logger.info(`Event [${eventType}] is triggered!`);
    this._eventHandlers[eventType].forEach(handler => {
      handler(payload);
    });
  }
  
  _updateTranscript(transcript) {
    this.transcript = transcript;
    this._triggerEvent('transcript-changed', transcript);
  }

  _updateTypingParticipants(typingParticipants) {
    this.typingParticipants = typingParticipants;
    this._triggerEvent('typing-participants-changed', typingParticipants);
  }

  _updateContactStatus(contactStatus) {
    this.contactStatus = contactStatus;
    this._triggerEvent('contact-status-changed', contactStatus);
  }

  _addEventListeners() {
    this.client.onMessage(data => {
      this._handleIncomingData(data);
    });
    this.client.onTyping(data => {
      this._handleTypingEvent(data);
    });
    
    this.client.onEnded(data => {
      this._handleEndedEvent(data);
    });
    this.client.onConnectionEstablished(() => {
      this._loadLatestTranscript();
    });
  }

  // TRANSCRIPT
  _loadLatestTranscript() {
    console.log("loadPreviousTranscript in single");
    return this._loadTranscript({
      scanDirection: "BACKWARD",
      sortOrder: "ASCENDING",
      maxResults: 15
    });
  }

  _loadTranscript(args) {
    return this.client.getTranscript(args).then(response => {
      var incomingDataList = response.data.Transcript;
      console.log("in _loadTranscript");
      console.log(response);
      const transcriptItems = incomingDataList.map(data => {
        var transcriptItem = modelUtils.createItemFromIncoming(
          data,
          this.thisParticipant
        );
        return transcriptItem;
      });
      this._addItemsToTranscript(transcriptItems);
    }).catch((err) => {
      console.log("CustomerUI", "ChatSession", "transcript fetch error: ", err);
    });
  }
  
  _handleIncomingData(dataInput) {
    var data = dataInput.data;
    var item = modelUtils.createItemFromIncoming(data, this.thisParticipant);

    console.log("_handleIncomingData item created");
    console.log(item);

    if (item) {
      if (!this._isRoundtripMessage(data)) {
        this._updateTypingParticipantsUsingIncoming(item);
      }
      console.log("_handleIncomingData item created");

      if(item.transportDetails.direction === Direction.Incoming){
        this._triggerEvent("incoming-message", data);
      }else{
        this._triggerEvent("outgoing-message", data);
      }

      const shouldBypassAddItemToTranscript = this.isOutgoingMessageInFlight === true && item.participantRole === PARTICIPANT_TYPES.CUSTOMER;

      if (!shouldBypassAddItemToTranscript) {
        this._addItemsToTranscript([item]);
      }

    } else {
      console.log("_handleIncomingData NOT NOT item created");
    }
  }

  _failMessage(message) {
    // Failed messages are going to be inserted into the transcript with a fake timestamp
    // that is 1ms higher than the timestamp of the last existing message or 0 if no such
    // message exists.
    const sentTime = this.transcript.length > 0
      ? this.transcript[this.transcript.length - 1].transportDetails.sentTime + 0.001
      : 0;
    this._replaceItemInTranscript(
      message,
      modelUtils.createFailedItem(message, sentTime)
    );
  }

  _isRoundTripSystemEvent(item) {
    return SYSTEM_EVENTS.indexOf(item.contentType) !== -1 && this.thisParticipant.participantId === item.participantId;
  }

  _addItemsToTranscript(items) {

    let self = this;

    if (items.length === 0) {
      return;
    }

    items = items.filter(item => !this._isRoundTripSystemEvent(item));

    console.log("ADD ITEMS", items);

    const newItemMap = items.reduce((acc, item) => ({...acc, [item.id]: item}), {});
    
    const newTranscript = this.transcript.filter(item => newItemMap[item.id] === undefined);
  
    newTranscript.push(...items);
    newTranscript.sort(
      (a, b) => {
        const isASending = a.transportDetails.status === Status.Sending;
        const isBSending = b.transportDetails.status === Status.Sending;
        if ((isASending && !isBSending) || (!isASending && isBSending)) {
          return isASending ? 1 : -1;
        }
        return a.transportDetails.sentTime - b.transportDetails.sentTime;
      }
    );   

    newTranscript.forEach(function(item){
      if(item.transportDetails.direction === Direction.Incoming){
        item = self.incomingItemDecorator(item);
      }else{
        item = self.outgoingItemDecorator(item);
    }
    }); 

    this._updateTranscript(newTranscript);
  }

  _replaceItemInTranscript(oldItem, newItem) {
    const idx = this.transcript.indexOf(oldItem);
    if (idx > -1) {
      this.transcript.splice(idx, 1);
    }
    this._addItemsToTranscript([newItem]);
  }

  _isRoundtripMessage(item) {
    return this.thisParticipant.participantId === item.ParticipantId
  }
  
  /** called when transcript has chat ended message */
  _handleEndedEvent(){
    this._updateContactStatus(CONTACT_STATUS.ENDED);
    this._triggerEvent("chat-disconnected");
  }

  // TYPING PARTICIPANTS
  
  _handleTypingEvent(dataInput) {
    var data = dataInput.data;
    if (this._isRoundtripMessage(data)) {
      return;
    }
    var incomingTypingParticipant = modelUtils.createTypingParticipant(
      data,
      this.thisParticipant.participantId
    );
    incomingTypingParticipant.callback = setTimeout(() => {
      this._removeTypingParticipant(
        incomingTypingParticipant.participantId
      );
    }, 12 * 1000);
    var newTypingParticipants = [];
    for (var i = 0; i < this.typingParticipants.length; i++) {
      var existingParticipantTyping = this.typingParticipants[i];
      if (
        existingParticipantTyping.participantId ===
        incomingTypingParticipant.participantId
      ) {
        clearTimeout(existingParticipantTyping.callback);
      } else {
        newTypingParticipants.push(existingParticipantTyping);
      }
    }
    newTypingParticipants.push(incomingTypingParticipant);
    this._updateTypingParticipants(newTypingParticipants);
    console.log("this.typingParticipants");
    console.log(this.typingParticipants);
  }

  _updateTypingParticipantsUsingIncoming(item) {
    if (item.type === PARTICIPANT_MESSAGE) {
      this._removeTypingParticipant(item.participantId);
    }
  }

  _removeTypingParticipant(participantId) {
    //this.typingParticipants = this.typingParticipants.filter(
    //  tp => tp.participantDetails.participantId !== participantId
    //);
    this._updateTypingParticipants([]);
  }
}

export default ChatSession;
