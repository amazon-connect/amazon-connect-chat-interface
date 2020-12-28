// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import request from '../../utils/fetchRequest';

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
 * @returns {Promise} Promise object that resolves to chatDetails objects
 */
export function initiateChat(input) {
  const initiateChatRequest = {
    InstanceId: input.instanceId,
    ContactFlowId: input.contactFlowId,
    ParticipantDetails: {
      DisplayName: input.name
    },
    Username: input.username,
  };

  const attributes = safeParse(input.contactAttributes, null);
  if (attributes) {
    initiateChatRequest.Attributes = attributes;
  }

  if (input.initialMessage) {
    initiateChatRequest.InitialMessage = {
      ContentType: "text/plain",
      Content: input.initialMessage
    };
  }

  let headers = new Headers();

  if (input.headers) {
    headers = input.headers;
  }

  return request(input.apiGatewayEndpoint, {
    headers,
    method: 'post',
    body: JSON.stringify(initiateChatRequest)
  })
    .then(res => res.json.data);
};
