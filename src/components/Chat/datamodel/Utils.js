// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import {
  Status,
  Direction,
  ItemDetails,
  TransportDetails,
  ContentType,
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
      item.ParticipantRole === PARTICIPANT_TYPES.CUSTOMER
        ? Direction.Outgoing
        : Direction.Incoming;
  transportDetails.sentTime = 
    new Date(item.AbsoluteTime).getTime() / 1000;
  transportDetails.status = Status.SendSuccess;
  transcriptItem.transportDetails = transportDetails;
  transcriptItem.version = 0;
  transcriptItem.Attachments = item.Attachments;
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

var modelUtils = {
  createItemFromIncoming: createItemFromIncoming,
  createOutgoingTranscriptItem: createOutgoingTranscriptItem,
  createFailedItem: createFailedItem,
  createTypingParticipant: createTypingParticipant,
  isRecognizedEvent: isRecognizedEvent,
  createTranscriptItemFromSuccessResponse: createTranscriptItemFromSuccessResponse,
  isAttachmentContentType: isAttachmentContentType,
};

export { modelUtils };