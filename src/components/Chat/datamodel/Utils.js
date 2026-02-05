// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  Status,
  Direction,
  ItemDetails,
  TransportDetails,
  ContentType,
  PARTICIPANT_TYPES,
  PARTICIPANT_MESSAGE,
  ATTACHMENT_MESSAGE,
  InteractiveMessageType,
} from "./Model";

function isRecognizedEvent(eventName) {
  var values = Object.values(ContentType.EVENT_CONTENT_TYPE);
  for (var index = 0; index < values.length; index++) {
    if (values[index] === eventName) {
      return true;
    }
  }
  return false;
}

function getContent(item) {
  var content = {};
  content.data = item.Content;
  content.type = item.ContentType;
  return content;
}

function createItemFromIncoming(item, thisParticipant) {
  var transcriptItem = new ItemDetails();
  var transportDetails = new TransportDetails();
  transcriptItem.id = item.Id;
  transcriptItem.type = item.Type;
  transcriptItem.content = getContent(item);
  transcriptItem.displayName = item.DisplayName;
  transcriptItem.participantId = item.ParticipantId;
  transcriptItem.participantRole = item.ParticipantRole;
  transportDetails.direction = 
      item.ParticipantRole === PARTICIPANT_TYPES.CUSTOMER
        ? Direction.Outgoing
        : Direction.Incoming;
  transportDetails.sentTime = 
    new Date(item.AbsoluteTime).getTime() / 1000;
  transportDetails.status = Status.SendSuccess;
  if (item.MessageMetadata && Array.isArray(item.MessageMetadata.Receipts) && item.MessageMetadata.Receipts.length > 0) {
    const receipt = item.MessageMetadata.Receipts.find(receipt => receipt.RecipientParticipantId !== transcriptItem.participantId) || {};
    transportDetails.messageReceiptType =  receipt.ReadTimestamp ? "read" : (receipt.DeliveredTimestamp ? "delivered" : "");
  }
  if (item.MessageMetadata && item.MessageMetadata.MessageCompleted !== null && item.MessageMetadata.MessageCompleted !== undefined) {
    transcriptItem.messageCompleted = item.MessageMetadata.MessageCompleted;
  }
  transcriptItem.transportDetails = transportDetails;
  transcriptItem.version = 0;
  transcriptItem.Attachments = item.Attachments;
  transcriptItem.isOldConversation = !!item.RelatedContactid;
  return transcriptItem;
}

function createTranscriptItemFromSuccessResponse(oldTranscriptItem, response) {
  const newTranscriptItem = new ItemDetails();
  Object.assign(newTranscriptItem, oldTranscriptItem);

  if(response.data && response.data.Id){
    newTranscriptItem.id = response.data.Id;
  }

  newTranscriptItem.transportDetails = {
    ...oldTranscriptItem.transportDetails,
    status: Status.SendSuccess,
    sentTime: new Date(response.data.AbsoluteTime || Date.now()).getTime() / 1000
  };
  return newTranscriptItem;
}

function createOutgoingTranscriptItem(type, content, participant){
  const transcriptItem = new ItemDetails();
  const transportDetails = {};
  transcriptItem.type = type;
  transcriptItem.content = content;
  transcriptItem.participantId = participant.participantId;
  transcriptItem.participantRole = PARTICIPANT_TYPES.CUSTOMER;
  transcriptItem.displayName = participant.displayName;
  transportDetails.status = Status.Sending;
  transportDetails.direction = Direction.Outgoing;
  transportDetails.sentTime = _timestampNow();
  transcriptItem.transportDetails = transportDetails;
  transcriptItem.id = _generateLocalId();
  transcriptItem.version = 0;
  return transcriptItem;
}

function createFailedItem(item, sentTime) {
  const clonedItem = new ItemDetails(item);
  clonedItem.transportDetails.status = Status.SendFailed;
  clonedItem.transportDetails.sentTime = sentTime;
  clonedItem.version = clonedItem.version + 1;
  return clonedItem;
}

function _generateLocalId() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function _timestampNow() {
  var date = new Date();
  var timestamp = date.getTime();
  return timestamp / 1000;
}

function createTypingParticipant(typingDataItem, thisParticipantId) {
  var participantTypingDetails = {};
  participantTypingDetails.participantId = typingDataItem.ParticipantId;
  participantTypingDetails.displayName = typingDataItem.DisplayName;
  var direction =
    thisParticipantId === typingDataItem.ParticipantId
      ? Direction.Outgoing
      : Direction.Incoming;
  participantTypingDetails.direction = direction;
  return participantTypingDetails;
}

function isAttachmentContentType(contentType) {
  return contentType && Object.values(ContentType.ATTACHMENT_CONTENT_TYPE).includes(contentType.toLowerCase());
}

function createIncomingTranscriptReceiptItem(thisParticipant, oldItemInTranscript, messageReceiptData, messageReceiptType) {
  const newTranscriptItem = new ItemDetails();
  Object.assign(newTranscriptItem, oldItemInTranscript);

  newTranscriptItem.transportDetails = {
    ...oldItemInTranscript.transportDetails,
    messageReceiptType: oldItemInTranscript.transportDetails.messageReceiptType === "read" ? "read" : messageReceiptType,
  };
  return newTranscriptItem;
}

function isTypeMessageOrAttachment(type) {
  return (type === PARTICIPANT_MESSAGE || type === ATTACHMENT_MESSAGE);
}

function isParticipantAgentOrCustomer(participantRole) {
  return (participantRole === PARTICIPANT_TYPES.CUSTOMER || participantRole === PARTICIPANT_TYPES.AGENT);
}

/**
 * A utility function to parse depth of 1 fields in the partially parsed view input data.
 *
 * @param {ViewInputData} parsedViewInputData - the partially parsed view input data
 * @returns {ViewInputData} the fully parsed view input data
 */
function fullyParseViewInputData(parsedViewInputData) {
  let fullyParsedViewInputData = {};
  Object.entries(parsedViewInputData).forEach(([key, value]) => {
    /**
     * There are two valid cases here: value is a string or an object.
     * In the cases that it is an object or an unparsable string, JSON.parse will throw.
     * In those cases, we will let the renderer see the raw value and determine whether it's the right format.
     * If it is in fact a valid stringified object, we will pass the parsed object to the renderer.
     */
    try {
      fullyParsedViewInputData[key] = JSON.parse(value);
    } catch (e) {
      fullyParsedViewInputData[key] = value;
    }
  });
  return fullyParsedViewInputData;
}

function createViewMessageData(data) {
  try {
    let parsedViewInputData = typeof data.content.viewData === "string" ? JSON.parse(data.content.viewData) : data.content.viewData;
    const outputViewData = {
      viewId: data.content.viewId,
      viewToken: data.content.viewToken,
      viewInputData: fullyParseViewInputData(parsedViewInputData)
    }
    return outputViewData;
  } catch (err) {
    console.warn("ERROR", err, data);
  }
}

function isViewMessage(message) {
  try {
    return message.content && message.content.data &&
      JSON.parse(message.content.data).templateType === InteractiveMessageType.VIEW_RESOURCE &&
      (
        message.content.type === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE ||
        message.content.type === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_RESPONSE
      );
  } catch (e) {
    return false;
  }
}

var modelUtils = {
  createItemFromIncoming: createItemFromIncoming,
  createOutgoingTranscriptItem: createOutgoingTranscriptItem,
  createFailedItem: createFailedItem,
  createTypingParticipant: createTypingParticipant,
  isRecognizedEvent: isRecognizedEvent,
  createTranscriptItemFromSuccessResponse: createTranscriptItemFromSuccessResponse,
  isAttachmentContentType: isAttachmentContentType,
  createIncomingTranscriptReceiptItem: createIncomingTranscriptReceiptItem,
  isTypeMessageOrAttachment: isTypeMessageOrAttachment,
  isParticipantAgentOrCustomer: isParticipantAgentOrCustomer,
  createViewMessageData: createViewMessageData,
  isViewMessage: isViewMessage,
};

export { modelUtils };
