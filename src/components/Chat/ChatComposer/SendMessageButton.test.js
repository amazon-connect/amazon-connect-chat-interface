// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import SendMessageButton from './SendMessageButton';
import { render, fireEvent } from "@testing-library/react"
import { KEYBOARD_KEY_CONSTANTS } from "connect-constants";

let mockSendMessageButton;
let mockProps;

function renderElement(props) {
  mockSendMessageButton = render(<SendMessageButton {...props}/>);
}

beforeEach(()=>{
  const sendMessage = jest.fn().mockResolvedValue(undefined);
  mockProps = { sendMessage };
});

test("Style should match the snapshot", () => {
  renderElement(mockProps);
  expect(mockSendMessageButton).toMatchSnapshot();
});

test("Should fire sendMessage onClick", () => {
  renderElement(mockProps);

  const sendMessageButton = mockSendMessageButton.getByTestId('customer-chat-send-message-button');
  fireEvent.click(sendMessageButton);

  expect(mockProps.sendMessage).toHaveBeenCalledTimes(1);
});

test("Should fire sendMessage onClick on Enter pressed", () => {
  renderElement(mockProps);
 
  const sendMessageButton = mockSendMessageButton.getByTestId('customer-chat-send-message-button');
  fireEvent.focus(sendMessageButton);
  fireEvent.keyDown(sendMessageButton, { key: KEYBOARD_KEY_CONSTANTS.ENTER });
 
  expect(mockProps.sendMessage).toHaveBeenCalledTimes(1);
});
 
test("Should fire sendMessage onClick on Space pressed", () => {
  renderElement(mockProps);
 
  const sendMessageButton = mockSendMessageButton.getByTestId('customer-chat-send-message-button');
  fireEvent.focus(sendMessageButton);
  fireEvent.keyDown(sendMessageButton, { key: KEYBOARD_KEY_CONSTANTS.SPACE });
 
  expect(mockProps.sendMessage).toHaveBeenCalledTimes(1);
});
