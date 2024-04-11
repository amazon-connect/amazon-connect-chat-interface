// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const LANGUAGES = [
  {
    displayName: "language.english",
    id: "en_US",
    value: "en",
    defaultMessage: "English"
  },
  {
    displayName: "language.german",
    id: "de_DE",
    value: "de",
    defaultMessage: "Deutsch"
  },
  {
    displayName: "language.spanish",
    id: "es_ES",
    value: "es",
    defaultMessage: "Español"
  },
  {
    displayName: "language.french",
    id: "fr_FR",
    value: "fr",
    defaultMessage: "Français"
  },
  {
    displayName: "language.italian",
    id: "it_IT",
    value: "it",
    defaultMessage: "Italiano"
  },
  {
    displayName: "language.japanese",
    id: "ja_JP",
    value: "ja",
    defaultMessage: "日本"
  },
  {
    displayName: "language.korean",
    id: "ko_KR",
    value: "ko",
    defaultMessage: "한국인"
  },
  {
    displayName: "language.portugues",
    id: "pt_BR",
    value: "pt",
    defaultMessage: "Português"
  },
  {
    displayName: "language.Chain",
    id: "zh_TW",
    value: "zh",
    defaultMessage: "中文(简体)"
  },
  {
    displayName: "language.Chain",
    id: "zh_CN",
    value: "zh",
    defaultMessage: "日本語"
  }
];

export const LANGUAGE_KEY = "selectedLanguage";

export const DEFAULT_LANGUAGE = "en";

export const CONTACT_STATUS = {
  CONNECTED: "connected",
  MISSED: "missed",
  ACW: "acw",
  INCOMING: "incoming",
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  ENDED: "ended",
  ACCEPTED: "accepted",
  ERROR: "error"
};

export const KEYBOARD_KEY_CONSTANTS = {
  ENTER: 'Enter',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  ESC: 'Escape',
  SPACE: ' ',
  DIGIT_0: '0',
  DIGIT_1: '1',
  DIGIT_2: '2',
  DIGIT_3: '3',
  DIGIT_4: '4',
  DIGIT_5: '5',
  DIGIT_6: '6',
  DIGIT_7: '7',
  DIGIT_8: '8',
  DIGIT_9: '9',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete'
};

export const CSM_CONSTANTS = {
  START_CHAT_REQUEST: 'START_CHAT_REQUEST',
  LOAD_WIDGET_LATENCY: 'LOAD_WIDGET_LATENCY',
  WIDGET_RENDER_ERROR: 'WIDGET_RENDER_ERROR',
  RENDER_INTERACTIVE_MESSAGE: '_RENDER_INTERACTIVE_MESSAGE',
  RENDER_RICH_MESSAGE: 'RENDER_RICH_MESSAGE',
  RENDER_PLAIN_MESSAGE: 'RENDER_PLAIN_MESSAGE',
  SEND_DELIVERED_RECEIPT: 'SEND_DELIVERED_RECEIPT',
  SEND_READ_RECEIPT: 'SEND_READ_RECEIPT',
}

export const CSM_CATEGORY = {
  API: "API",
  UI: "UI"
};