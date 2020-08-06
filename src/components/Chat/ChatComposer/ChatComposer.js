// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Component } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import PT from "prop-types";
import { CONTACT_STATUS } from "connect-constants";

const ChatComposerWrapper = styled.div`
  order: 3;
  background: ${props => props.theme.palette.white};
`;
const EditorHintText = styled.div`
  position: absolute;
  color: ${props => props.theme.palette.lightGray};
  font-family: ${props => props.theme.fonts.light};
  z-index: 1;
  padding: ${props => props.theme.spacing.small};
  pointer-events: none;
`;
const EditableContainer = styled.div`
  outline: none;
  user-select: text;
  word-break: break-word;
  border: 0.5px solid ${props => props.theme.palette.lightGray};
  border-left: 0;
  border-right: 0;
  padding: ${props => props.theme.spacing.small};
  max-height: 80px;
  overflow: auto;
  min-height: 39px;
  z-index: 2;
`;

export default class ChatComposer extends Component {
  static propTypes = {
    addMessage: PT.func,
    onTyping: PT.func,
    contactId: PT.string.isRequired,
    contactStatus: PT.string.isRequired,
    onTypingValidityTime: PT.number
  };

  static defaultProps = {
    // Default props
    onTypingValidityTime: 10 * 1000
  };

  state = {
    message: ""
  };

  constructor(props) {
    super(props);
    this.onTypingCalled = false;
  }

  onTyping = event => {
    let self = this;
    if (!this.hasSameContent(event)) {
      if (this.onTypingCalled) {
        return;
      }
      this.props.onTyping(this.props.contactId, event.target.innerText !== '');
      this.onTypingCalled = true;
      setTimeout(() => {
        self.onTypingCalled = false;
      }, self.props.onTypingValidityTime);
    }
  };

  hasSameContent = event => {
    return event.target.innerText === this.state.message;
  };

  onMessageInput = event => {
    this.onTyping(event);
    this.setState({ message: event.target.innerText });
    if (!event.shiftKey && event.which === 13) {
      event.preventDefault();
      this.sendMessage();
      event.target.innerText = "";
      this.setState({ message: "" });
      return false;
    }
  };

  sendMessage = () => {
    if (this.state.message.toString().trim()) {
      this.props.addMessage(this.props.contactId, {
        text: this.state.message
      });
      this.setState({ message: "" });
    }
  };

  onPaste = e => {
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  render() {
    return (
      <ChatComposerWrapper>
        {(this.props.contactStatus === CONTACT_STATUS.CONNECTED) && (
          <React.Fragment>
            <EditorHintText>
              {!this.state.message && (
                <FormattedMessage
                  id="connect.chat.composer.hintText"
                  defaultMessage="Type a message"
                />
              )}
            </EditorHintText>

            <EditableContainer
              onInput={this.onMessageInput}
              onKeyPress={this.onMessageInput}
              onKeyDown={this.onMessageInput}
              role="textbox"
              aria-label="type a message"
              tabIndex="0"
              contentEditable="true"
              spellCheck="true"
              onPaste={this.onPaste}
            />
          </React.Fragment>
        )}
      </ChatComposerWrapper>
    );
  }
}
