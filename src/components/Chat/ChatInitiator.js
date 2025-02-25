// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import request from "../../utils/fetchRequest";
import { START_CHAT_CLIENT_TIMEOUT_MS } from "../../constants/http";

function safeParse(jsonString, defaultValue) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Initiate a chat session within Amazon Connect, proxying initial StartChatContact request
 * through your API Gateway.
 *
 * https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html
 *
 * @param {Object} input - data to initate chat
 * @param {string} input.instanceId
 * @param {string} input.contactFlowId
 * @param {string} input.apiGatewayEndpoint
 * @param {string} input.name
 * @param {string} input.initialMessage - optional initial message to start chat
 * @param {string} input.region
 * @param {string} input.contactAttributes
 * @param {object} input.headers
 * @param {string} input.supportedMessagingContentTypes
 * @param {number} input.chatDurationInMinutes
 * @returns {Promise} Promise object that resolves to chatDetails objects
 */
export function initiateChat(input) {
  if (input.chatSessionParameters) {
    return { startChatResult: input.chatSessionParameters };
  }
  const initiateChatRequest = {
    InstanceId: input.instanceId,
    ContactFlowId: input.contactFlowId,
    ParticipantDetails: {
      DisplayName: input.name,
    },
    Username: input.username,
  };

  if (input.persistentChat) {
    if (input.persistentChat.sourceContactId && input.persistentChat.rehydrationType) {
      initiateChatRequest.PersistentChat = {
        SourceContactId: input.persistentChat.sourceContactId,
        RehydrationType: input.persistentChat.rehydrationType,
      };
    }
  }

  const attributes = safeParse(input.contactAttributes, null);
  if (attributes) {
    initiateChatRequest.Attributes = attributes;
  }

  if (input.initialMessage) {
    initiateChatRequest.InitialMessage = {
      ContentType: "text/plain",
      Content: input.initialMessage,
    };
  }

  if (input.supportedMessagingContentTypes) {
    initiateChatRequest.SupportedMessagingContentTypes = input.supportedMessagingContentTypes.split(",");
  }

  if (input.chatDurationInMinutes) {
    initiateChatRequest.ChatDurationInMinutes = Number(input.chatDurationInMinutes);
  }

  let headers = new Headers();

  if (input.headers) {
    headers = input.headers;
  }

  return request(
    input.apiGatewayEndpoint,
    {
      headers,
      method: "post",
      body: JSON.stringify(initiateChatRequest),
    },
    START_CHAT_CLIENT_TIMEOUT_MS
  ).then((res) => res.json.data);
}
