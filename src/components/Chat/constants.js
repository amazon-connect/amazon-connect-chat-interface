// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// eslint-disable-next-line
export const URL_MATCH_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;

export const CHAT_STATUS_TYPES = {
  CONNECTED: "connected",
  MISSED: "missed",
  ACW: "acw",
  INCOMING: "incoming",
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  ENDED: "ended",
  ACCEPTED: "accepted",
  ERROR: "error",
};

export const CHAT_FEATURE_TYPES = {
  ATTACHMENTS: "ATTACHMENTS",
  TYPING_EVENT_FOR_BOTS: "TYPING_EVENT_FOR_BOTS",
};

export const FAIL_AFTER_NO_RETURN_SECONDS = 10;

export const INTERACTIVE_MESSAGE = {
  ACTIONS: {
    SHOW_MORE: "SHOW_MORE",
    PREVIOUS_OPTIONS: 'PREVIOUS_OPTIONS'
  },
  VERSION: "1.0"
}

export const AUTHENTICATION_POPUP_WIDTH = 600;
export const AUTHENTICATION_POPUP_HEIGHT = 600;

export const DEFAULT_BOT_DISPLAY_NAME = "BOT";

export const MOCK_TYPING_PARTICIPANT_ID = 'mocked-typing-participant-id';
export const MOCK_TYPING_PARTICIPANT_NAME = 'MockedTypingParticipantName';
