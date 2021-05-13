// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import ChatComposer from './ChatComposer';
import { ThemeProvider } from '../../../theme';
import { render, fireEvent } from "@testing-library/react"
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

test("Should be able to unselect an attachment", () => {
  renderElement(mockProps);
  const fileInput = mockComposer.getByTestId("customer-chat-file-select");
  fireEvent.change(fileInput, {target: { files: [ mockAttachmentsFile ]}});
  const textInput = mockComposer.getByTestId("customer-chat-text-input");
  fireEvent.keyDown(textInput, { key: KEYBOARD_KEY_CONSTANTS.DELETE});
  fireEvent.keyDown(textInput, { key: KEYBOARD_KEY_CONSTANTS.ENTER});
  expect(mockProps.addAttachment).toHaveBeenCalledTimes(0);
});