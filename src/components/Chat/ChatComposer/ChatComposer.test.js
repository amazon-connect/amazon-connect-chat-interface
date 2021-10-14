// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import ChatComposer from './ChatComposer';
import { ThemeProvider } from '../../../theme';
import { render, fireEvent } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import { ContentType } from "../datamodel/Model";
import { KEYBOARD_KEY_CONSTANTS } from "connect-constants";

const mockAttachmentsFile = {
  name: "testUpload.pdf",
  type: ContentType.ATTACHMENT_CONTENT_TYPE.PDF,
  size: 1
};

let mockComposer;
let mockProps;

function renderElement(props) {
  mockComposer = render(<ThemeProvider>
      <ChatComposer {...props}/>
  </ThemeProvider>);
}

beforeEach(()=>{
  const onTyping = jest.fn().mockResolvedValue(undefined);
  const addMessage = jest.fn().mockResolvedValue(undefined);
  const addAttachment = jest.fn().mockResolvedValue(undefined);
  mockProps = {onTyping: onTyping, addAttachment: addAttachment, addMessage: addMessage, contactId: "12344", contactStatus:"connected", typedMessage: "", composerConfig: { attachmentsEnabled: true }};
});

test("Style should match the snapshot", () => {
  renderElement(mockProps);
  expect(mockComposer).toMatchSnapshot();
});

test("Should not be able to see the paperclip icon without permission", () => {
  mockProps.composerConfig.attachmentsEnabled = false;
  renderElement(mockProps);
  expect(mockComposer.queryByTestId("customer-chat-file-select")).toBeNull();
});

test("Should be able to send an attachment", () => {
  renderElement(mockProps);
  const fileInput = mockComposer.getByTestId("customer-chat-file-select");
  fireEvent.change(fileInput, {target: { files: [ mockAttachmentsFile ]}});
  const textInput = mockComposer.getByTestId("customer-chat-text-input");
  fireEvent.keyDown(textInput, { key: KEYBOARD_KEY_CONSTANTS.ENTER});
  expect(mockProps.addAttachment).toHaveBeenCalledTimes(1);
  expect(mockProps.addAttachment).toHaveBeenCalledWith(mockProps.contactId, {...mockAttachmentsFile});
});

test("Should be able to send an attachment via the send message button", () => {
  renderElement(mockProps);

  const fileInput = mockComposer.getByTestId("customer-chat-file-select");
  fireEvent.change(fileInput, {target: { files: [ mockAttachmentsFile ]}});

  const sendMessageButton = mockComposer.getByTestId('customer-chat-send-message-button');
  fireEvent.click(sendMessageButton);

  expect(mockProps.addAttachment).toHaveBeenCalledTimes(1);
  expect(mockProps.addAttachment).toHaveBeenCalledWith(mockProps.contactId, {...mockAttachmentsFile});
});

test("Should be able to send a message via the send message button", async () => {
  renderElement(mockProps);

  const testMessage = 'Hello, World!';
  const textInput = mockComposer.getByTestId('customer-chat-text-input');
  userEvent.type(textInput, testMessage);

  const sendMessageButton = mockComposer.getByTestId('customer-chat-send-message-button');
  fireEvent.click(sendMessageButton);

  expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
  expect(mockProps.addMessage).toHaveBeenCalledWith(mockProps.contactId, { text: testMessage });
});

test("Should be able to send an attachment plus additional text via the send message button", () => {
  renderElement(mockProps);

  const fileInput = mockComposer.getByTestId("customer-chat-file-select");
  fireEvent.change(fileInput, {target: { files: [ mockAttachmentsFile ]}});

  const testMessage = 'Hello, World!';
  const textInput = mockComposer.getByTestId('customer-chat-text-input');
  userEvent.type(textInput, testMessage);

  const sendMessageButton = mockComposer.getByTestId('customer-chat-send-message-button');
  fireEvent.click(sendMessageButton);

  expect(mockProps.addAttachment).toHaveBeenCalledTimes(1);
  expect(mockProps.addAttachment).toHaveBeenCalledWith(mockProps.contactId, {...mockAttachmentsFile});

  expect(mockProps.addMessage).toHaveBeenCalledTimes(1);
  expect(mockProps.addMessage).toHaveBeenCalledWith(mockProps.contactId, { text: testMessage });
});

test("Should not send message if send button is clicked and there is no input", () => {
  renderElement(mockProps);
  const sendMessageButton = mockComposer.getByTestId('customer-chat-send-message-button');
  fireEvent.click(sendMessageButton);

  expect(mockProps.addMessage).toHaveBeenCalledTimes(0);
});

test("Should be able to unselect an attachment", () => {
  renderElement(mockProps);
  const fileInput = mockComposer.getByTestId("customer-chat-file-select");
  fireEvent.change(fileInput, {target: { files: [ mockAttachmentsFile ]}});
  const textInput = mockComposer.getByTestId("customer-chat-text-input");
  fireEvent.keyDown(textInput, { key: KEYBOARD_KEY_CONSTANTS.DELETE});
  fireEvent.keyDown(textInput, { key: KEYBOARD_KEY_CONSTANTS.ENTER});
  expect(mockProps.addAttachment).toHaveBeenCalledTimes(0);
});