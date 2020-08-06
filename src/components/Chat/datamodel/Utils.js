// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  Status,
  Direction,
  ItemDetails,
  TransportDetails,
  ContentType,
  PARTICIPANT_MESSAGE,
  PARTICIPANT_TYPES
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
    thisParticipant.participantId === transcriptItem.participantId
      ? Direction.Outgoing
      : Direction.Incoming
  transportDetails.sentTime = 
    new Date(item.AbsoluteTime).getTime() / 1000;
  transportDetails.status = Status.SendSuccess;
  transcriptItem.transportDetails = transportDetails;
  transcriptItem.version = 0;
  return transcriptItem;
}

function createMessageFromSendMessageResponse(oldMessage, response) {
  var newMessage = new ItemDetails();
  Object.assign(newMessage, oldMessage);
  newMessage.id = response.data.Id;
  newMessage.transportDetails.status = Status.SendSuccess;
  newMessage.transportDetails.sentTime = new Date(response.data.AbsoluteTime).getTime() / 1000;
  return newMessage;
}

function createMessageFromOutgoing(data, thisParticipant) {
  var transcriptItem = new ItemDetails();
  var content = {};
  var transportDetails = {};
  content.data = data.text;
  content.type = ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN;
  transcriptItem.content = content;
  transcriptItem.participantId = thisParticipant.participantId;
  transcriptItem.participantRole = PARTICIPANT_TYPES.AGENT;
  transcriptItem.displayName = thisParticipant.displayName;
  transportDetails.status = Status.Sending;
  transportDetails.direction = Direction.Outgoing;
  transportDetails.sentTime = _timestampNow();
  transcriptItem.transportDetails = transportDetails;
  transcriptItem.type = PARTICIPANT_MESSAGE;
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

var modelUtils = {
  createItemFromIncoming: createItemFromIncoming,
  createMessageFromOutgoing: createMessageFromOutgoing,
  createFailedItem: createFailedItem,
  createTypingParticipant: createTypingParticipant,
  isRecognizedEvent: isRecognizedEvent,
  createMessageFromSendMessageResponse: createMessageFromSendMessageResponse
};

export { modelUtils };
