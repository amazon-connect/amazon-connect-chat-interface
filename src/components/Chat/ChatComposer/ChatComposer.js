// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";
import PT from "prop-types";
import { CONTACT_STATUS, KEYBOARD_KEY_CONSTANTS } from "connect-constants";
import TextareaAutosize from 'react-textarea-autosize';

import { ATTACHMENT_ACCEPT_CONTENT_TYPES } from "../datamodel/Model";

const ChatComposerWrapper = styled.div`
  display: flex;
  order: 3;
  background: ${props => props.theme.palette.white};
  border: 0.5px solid ${props => props.theme.palette.lightGray};
  border-left: 0;
  border-right: 0;
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
    padding-left: ${props => props.theme.spacing.mini};
    padding-right: ${props => props.theme.spacing.mini};
    margin-bottom: 0;
  }
  
  input {
    display: none;
  }
  
  &+[role='textbox']{
    padding-left: 0;
  }
`;

const IconButton = styled.div`    
    background-color: transparent;
    border: 1px solid transparent;
    position: relative;
    padding: 0;
    margin: 0;
    height:100%;
`;

const AttachmentContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.chatTranscriptor.outgoingMsgBg};
  border-radius: 5px;
  margin: 5px;
  padding: ${props => props.theme.spacing.mini};
  min-width: 0;
  
  &>div {
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
  
  &+div{
    padding-left: 0;
  }
`;

const TextInput = styled(TextareaAutosize)`
  flex: 1;
  outline: none;
  user-select: text;
  word-break: break-word;
  font-family: inherit;
  padding: ${props => props.theme.spacing.small};
  padding-left: 0;
  margin-left: ${props => props.theme.spacing.small};
  max-height: 80px;
  line-height: 1.5rem;
  overflow: auto;
  min-height: 39px;
  z-index: 2;
  resize: none; 
  letter-spacing: ${(props) => props.theme.globals.letterSpacing};
  font-size: ${props => props.theme.fontsSize.regular};
  border: none;

  &::placeholder {
    color: ${props => props.theme.palette.mediumGray};
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
    width: ${({theme}) => theme.fontsSize.mini};
	height: ${({theme}) => theme.fontsSize.mini};
  }
`;

ChatComposer.propTypes = {
  addMessage: PT.func,
  addAttachment: PT.func,
  onTyping: PT.func,
  contactId: PT.string.isRequired,
  contactStatus: PT.string.isRequired,
  onTypingValidityTime: PT.number,
  composerConfig: PT.object
};

ChatComposer.defaultProps = {
  onTypingValidityTime: 10 * 1000
};

export default function ChatComposer({ addMessage, addAttachment, onTyping, contactId, contactStatus, onTypingValidityTime, textInputRef, composerConfig }) {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  useLayoutEffect(() => {
    if (!textInputRef || !textInputRef.current || !textInputRef.current.focus) {
      return;
    }
    textInputRef.current.focus();
  }, [attachment]);

  function hasSameContent(event) {
    return event.target.innerText === message;
  }

  function onInput(event) {
    if (!event.shiftKey && event.key === KEYBOARD_KEY_CONSTANTS.ENTER) {
      event.preventDefault();
      throttledOnTyping.cancel();
      sendTextMessage(event.target.value);
      setMessage("");

      if (attachment) {
        sendAttachment();
        clearFileInput();
      }

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

  const throttledOnTyping = useCallback(
      throttle(() => {
        onTyping().then(() => {
          console.log("CCP", "ChatComposer", "On typing event sent successfully");
        });
      }, onTypingValidityTime),
      [onTypingValidityTime]
  );

  function sendTextMessage(text) {
    if (text.trim()) {
      addMessage(contactId, { text });
    }
  }

  function onFileInput(e) {
    const file = e.target.files[0];
    setAttachment(file);
  }

  function clearFileInput() {
    setAttachment(null);
    fileInputRef.current.value = null;
  }

  function sendAttachment() {
    addAttachment(contactId, attachment);
  }

  const ariaLabel = "Type a message";
  const placeholder = attachment == null ? ariaLabel : "";

  return (
      <ChatComposerWrapper>
        {(contactStatus === CONTACT_STATUS.CONNECTED) && (
            <React.Fragment>
              {composerConfig.attachmentsEnabled &&
              <PaperClipContainer>
                <IconButton aria-label={"Attach a file"}>
                  <label htmlFor={`customer-chat-file-select-${contactId}`}>
                    <PaperClipIcon>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                      </svg>
                    </PaperClipIcon>
                    <input ref={fileInputRef} type="file" id={`customer-chat-file-select-${contactId}`} data-testid={`customer-chat-file-select`}
                           accept={ATTACHMENT_ACCEPT_CONTENT_TYPES.join(',')}
                           onChange={onFileInput} aria-label={"Attach a file"} tabIndex={-1}/>
                  </label>
                </IconButton>
              </PaperClipContainer>}
              {(attachment != null) && (
                  <AttachmentContainer>
                    <div>
                      <span>{attachment.name}</span>
                      <IconButton onClick={clearFileInput} aria-label={"Remove attachment"}>
                        <CloseIcon>
                          <svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <path d="M13 1.3L11.7 0 6.5 5.2 1.3 0 0 1.3l5.2 5.2L0 11.7 1.3 13l5.2-5.2 5.2 5.2 1.3-1.3-5.2-5.2z" fillRule="evenodd"/>
                          </svg>
                        </CloseIcon>
                      </IconButton>
                    </div>
                  </AttachmentContainer>
              )}
              <TextInput
                  data-testid={`customer-chat-text-input`}
                  ref={textInputRef}
                  value={message}
                  onInput={onInput}
                  onKeyPress={onInput}
                  onKeyDown={onInput}
                  aria-label={ariaLabel}
                  placeholder={placeholder}
                  tabIndex="0"
                  spellCheck="true"
              />
            </React.Fragment>
        )}
      </ChatComposerWrapper>
  );
}