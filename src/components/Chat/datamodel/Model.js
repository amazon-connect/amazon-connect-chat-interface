// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const PARTICIPANT_MESSAGE = "MESSAGE";
export const CHAT_EVENT = "EVENT";

export const PARTICIPANT_TYPES = {
    AGENT: "AGENT",
    CUSTOMER: "CUSTOMER"
};

export const ContentType = {
    EVENT_CONTENT_TYPE: {
        TYPING: "application/vnd.amazonaws.connect.event.typing",
        PARTICIPANT_JOINED: "application/vnd.amazonaws.connect.event.participant.joined",
        PARTICIPANT_LEFT: "application/vnd.amazonaws.connect.event.participant.left",
        TRANSFER_SUCCEEDED: "application/vnd.amazonaws.connect.event.transfer.succeed",
        TRANSFER_FAILED: "application/vnd.amazonaws.connect.event.transfer.failed",
        CONNECTION_ACKNOWLEDGED: "application/vnd.amazonaws.connect.event.connection.acknowledged",
        CHAT_ENDED: "application/vnd.amazonaws.connect.event.chat.ended"
    },
    MESSAGE_CONTENT_TYPE: {
        TEXT_PLAIN: "text/plain"
    }
};

export const Status = {
    Sending: "Sending",
    SendSuccess: "SendSuccess",
    SendFailed: "SendFailed",
    Read: "Read"
    // Delivered?
};

export const Direction = {
    Outgoing: "Outgoing",
    Incoming: "Incoming"
};

export class TransportDetails {
    constructor(input) {
        var args = input || {};
        this.direction = args.direction;
        this.readTime = args.readTime;
        this.status = args.status;
        this.sentTime = args.sentTime;
    }
}

export class ItemDetails {
    constructor(input) {
        var args = input || {};
        this.id = args.id;
        this.type = args.type;
        this.content = args.content;
        this.displayName = args.displayName;
        this.participantId = args.participantId;
        this.participantRole = args.participantRole;
        this.transportDetails = args.transportDetails;
    }
}
