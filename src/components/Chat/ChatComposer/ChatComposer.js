// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useLayoutEffect, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";
import PT from "prop-types";
import { CONTACT_STATUS, KEYBOARD_KEY_CONSTANTS } from "connect-constants";
import TextareaAutosize from "react-textarea-autosize";
import SendMessageButton from "./SendMessageButton";
import { RichTextEditor } from "../RichMessageComponents";

import { ATTACHMENT_ACCEPT_CONTENT_TYPES, ContentType } from "../datamodel/Model";

const ChatComposerWrapper = styled.div`
  margin: 0;
  padding: 0;
`;

const DefaultChatComposerWrapper = styled.div`
  position: relative;
  display: flex;
  background: ${(props) => props.theme.palette.white};
  border: 0.5px solid ${(props) => props.theme.palette.lightGray};
  border-left: 0;
  border-right: 0;
`;

const SendMessageButtonContainer = styled.div`
  position: absolute;
  padding: ${(props) => props.theme.spacing.small};
  padding-right: ${(props) => props.theme.spacing.base};
  top: 0;
  right: 0;
  z-index: 2;
`;

const PaperClipContainer = styled.div`
  cursor: pointer;
  height: auto;
  vertical-align: top;

  button {
    height: 100%;
    width: 100%;
  }

  label {
    align-items: center;
    display: flex;
    cursor: pointer;
    font-size: 0;
    height: 100%;
    padding-left: ${(props) => props.theme.spacing.mini};
    padding-right: ${(props) => props.theme.spacing.mini};
    margin-bottom: 0;
  }

  input {
    display: none;
  }

  & + [role="textbox"] {
    padding-left: 0;
  }
`;

const IconButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  position: relative;
  padding: 0;
  margin: 0;
`;

const AttachmentContainer = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.chatTranscriptor.outgoingMsgBg};
  border-radius: 5px;
  margin: 5px;
  padding: ${(props) => props.theme.spacing.mini};
  min-width: 0;

  & > div {
    width: 100%;

    span {
      overflow-wrap: break-word;
    }

    button {
      align-items: center;
      display: inline-flex;
      cursor: pointer;
      margin-left: 5px;
    }
  }

  & + div {
    padding-left: 0;
  }
`;

const TextInput = styled(TextareaAutosize)`
  flex: 1;
  outline: none;
  user-select: text;
  word-break: break-word;
  font-family: inherit;
  font-size: 1rem !important;
  padding: ${(props) => props.theme.spacing.small};
  padding-left: 0;
  padding-right: ${(props) => props.theme.spacing.xxlarge};
  margin-left: ${(props) => props.theme.spacing.small};
  max-height: 80px;
  line-height: 1.5rem;
  overflow: auto;
  min-height: 39px;
  z-index: 2;
  resize: none;
  letter-spacing: ${(props) => props.theme.globals.letterSpacing};
  font-size: ${(props) => props.theme.fontsSize.regular || "1rem"};
  border: none;

  &::placeholder {
    color: ${(props) => props.theme.palette.mediumGray};
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const PaperClipIcon = styled.div`
  display: flex;
  font-size: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const CloseIcon = styled.div`
  display: flex;
  font-size: 0;
  svg {
    width: ${({ theme }) => theme.fontsSize.mini};
    height: ${({ theme }) => theme.fontsSize.mini};
  }
`;

ChatComposer.propTypes = {
  addMessage: PT.func,
  addAttachment: PT.func,
  onTyping: PT.func,
  contactId: PT.string.isRequired,
  contactStatus: PT.string.isRequired,
  onTypingValidityTime: PT.number,
  composerConfig: PT.object,
};

ChatComposer.defaultProps = {
  onTypingValidityTime: 10 * 1000,
};

export default function ChatComposer({ addMessage, addAttachment, onTyping, contactId, contactStatus, onTypingValidityTime, textInputRef, composerConfig }) {
  let logger;
  let mobileJitter;
  if (window.connect && window.connect.LogManager) {
    logger = window.connect.LogManager.getLogger({
      prefix: "ChatInterface-ChatComposer",
    });
  }
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    logger && logger.info("Component mounted.");
  }, [logger]);

  useLayoutEffect(() => {
    if (!textInputRef || !textInputRef.current || !textInputRef.current.focus) {
      return;
    }
    textInputRef.current.focus();
  }, [attachment, textInputRef]);

  function hasSameContent(event) {
    return event.target.innerText === message;
  }

  function onInput(event) {
    if (!event.shiftKey && event.key === KEYBOARD_KEY_CONSTANTS.ENTER) {
      event.preventDefault();
      sendMessage();

      return false;
    } else {
      if (!hasSameContent(event)) {
        throttledOnTyping();
      }
      setMessage(event.target.value);
    }

    if (event.key === KEYBOARD_KEY_CONSTANTS.DELETE || event.key === KEYBOARD_KEY_CONSTANTS.BACKSPACE) {
      if (attachment && message === "") {
        event.preventDefault();
        clearFileInput();
        return;
      }
    }
  }

  /**
   * Fix for https://app.asana.com/0/1200039825797577/1202475657019640/f
   * Bug: In iOS browser when we focus on input elem, virtual keyboard pops up on top of the chat content and we can not scroll and view entire chat.
   * Fix: We create a temp input element at top of screen and set focus, then we set focus back to the actual input element.
   *      This forces the viewport scrollbar to recalculate scroll position initially to focus on top of the new viewport screen and then to the bottom which brings actual input element within the new viewport.
   *      Note: "new viewport" - refers to the small screen after virtual keyboard is displayed on iphone.
   */
  function onTextInputFocus() {
    if (!mobileJitter && isIphone()) {
      mobileJitter = true;
      const tempInputElem = document.createElement("input");
      const chatWidgetWrapper = document.querySelector('[data-testid="amazon-connect-chat-wrapper"] div');
      if (chatWidgetWrapper) {
        chatWidgetWrapper.appendChild(tempInputElem);
        tempInputElem.focus();
      }

      setTimeout(() => {
        textInputRef && textInputRef.current && textInputRef.current.focus();
        tempInputElem.remove();
        mobileJitter = false;
      }, 300);
    }
  }

  function isIphone() {
    const userAgent = window.navigator && window.navigator.userAgent;
    return userAgent && userAgent.search(/iPhone/i) !== -1;
  }

  /**
   * Cancel any pending (not flushed) typing events, send the message (and attachment if applicable), and clear input bar.
   */
  function sendMessage() {
    throttledOnTyping.cancel();
    sendTextMessage(message);
    setMessage("");

    if (attachment) {
      sendAttachment();
      clearFileInput();
    }
  }

  const throttledOnTyping = useMemo(
    () =>
      throttle(
        () => {
          onTyping().then(() => {
            console.log("On typing event");
          });
        },
        onTypingValidityTime,
        { trailing: false, leading: true }
      ),
    [onTyping, onTypingValidityTime, { trailing: false, leading: true }]
  );

  function sendTextMessage(text) {
    if (text.trim()) {
      addMessage(contactId, { text });
    }
  }

  function sendMarkdownMessage(markdownMessage) {
    throttledOnTyping.cancel();
    if (markdownMessage.trim()) {
      addMessage(contactId, {
        text: markdownMessage,
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_MARKDOWN,
      });
    }
  }

  function onFileInput(e) {
    const file = e.target.files[0];
    setAttachment(file);
    logger && logger.info(`File added.`);
  }

  function clearFileInput() {
    setAttachment(null);
    fileInputRef.current.value = null;
    logger && logger.info(`File is removed.`);
  }

  function sendAttachment() {
    addAttachment(contactId, attachment);
  }

  function sendAttachmentGivenFile(file) {
    addAttachment(contactId, file);
  }

  const ariaLabel = "Type a message";
  const placeholder = attachment == null ? ariaLabel : "";

  const richMessagingComposer = (
    <RichTextEditor
      allowedFileContentTypes={ATTACHMENT_ACCEPT_CONTENT_TYPES}
      attachmentsEnabled={composerConfig && composerConfig.attachmentsEnabled}
      sendMessage={sendMarkdownMessage}
      sendAttachment={sendAttachmentGivenFile}
      placeholder={placeholder}
      onTyping={throttledOnTyping}
    ></RichTextEditor>
  );

  const defaultComposer = (
    <DefaultChatComposerWrapper>
      {contactStatus === CONTACT_STATUS.CONNECTED && (
        <React.Fragment>
          {composerConfig && composerConfig.attachmentsEnabled && (
            <PaperClipContainer
              tabIndex={0}
              data-testid="customer-chat-attachment-icon"
              onKeyDown={(e) => {
                // if space or enter is pressed
                if (e.key === KEYBOARD_KEY_CONSTANTS.SPACE || e.key === KEYBOARD_KEY_CONSTANTS.ENTER) {
                  e.preventDefault();
                  document.getElementById(`customer-chat-file-select-${contactId}`).click();
                }
              }}
            >
              <IconButton aria-label={"Attach a file"}>
                <label htmlFor={`customer-chat-file-select-${contactId}`}>
                  <PaperClipIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                    </svg>
                  </PaperClipIcon>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id={`customer-chat-file-select-${contactId}`}
                    data-testid={`customer-chat-file-select`}
                    accept={ATTACHMENT_ACCEPT_CONTENT_TYPES.join(",")}
                    onChange={onFileInput}
                    aria-label={"Attach a file"}
                    tabIndex={-1}
                  />
                </label>
              </IconButton>
            </PaperClipContainer>
          )}
          {attachment != null && (
            <AttachmentContainer>
              <div>
                <span>{attachment.name}</span>
                <IconButton onClick={clearFileInput} aria-label={"Remove attachment"}>
                  <CloseIcon>
                    <svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M13 1.3L11.7 0 6.5 5.2 1.3 0 0 1.3l5.2 5.2L0 11.7 1.3 13l5.2-5.2 5.2 5.2 1.3-1.3-5.2-5.2z" fillRule="evenodd" />
                    </svg>
                  </CloseIcon>
                </IconButton>
              </div>
            </AttachmentContainer>
          )}
          <TextInput
            data-testid="customer-chat-text-input"
            ref={textInputRef}
            value={message}
            onInput={onInput}
            onKeyPress={onInput}
            onKeyDown={onInput}
            onFocus={onTextInputFocus}
            aria-label={ariaLabel}
            placeholder={placeholder}
            tabIndex="0"
            spellCheck="true"
          />
          <SendMessageButtonContainer>
            <SendMessageButton isActive={!!message || attachment} sendMessage={sendMessage.bind(this)} />
          </SendMessageButtonContainer>
        </React.Fragment>
      )}
    </DefaultChatComposerWrapper>
  );

  return <ChatComposerWrapper>{composerConfig && composerConfig.richMessagingEnabled ? richMessagingComposer : defaultComposer}</ChatComposerWrapper>;
}
