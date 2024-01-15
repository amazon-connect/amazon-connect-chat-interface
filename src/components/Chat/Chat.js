// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import PT from "prop-types";
import { CONTACT_STATUS } from "../../constants/global";
import ChatTranscriptor from "./ChatTranscriptor";
import ChatComposer from "./ChatComposer";
import ChatActionBar from "./ChatActionBar";
import React, { Component } from "react";
import {Text} from "connect-core";
import styled from "styled-components";

import renderHTML from 'react-render-html';

const ChatWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  @media (max-width:640px) {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
`;

const ParentHeaderWrapper = styled.div`
  margin: 0;
  padding: 0;
  order: 1;
  @media (max-width: 640px) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
`;

const ChatComposerWrapper = styled.div`
  order: 2;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 340px;
  @media (max-width:640px) {
    position: absolute;
    left: 0;
    bottom: 85px;
    right: 0;
    top: ${props => props.parentHeaderWrapperHeight}px;
    min-height: auto;
  }
`;

const HeaderWrapper = styled.div`
  background: #3F5773;
  text-align: center;
  padding: 16px;
  color: #fff;
  border-radius: 3px;
  flex-shrink: 0;
`
const WelcomeText  = styled(Text)`
  padding-bottom: 10px;
`


const defaultHeaderConfig =  {
  isHTML: false,
  render: () => {
    return (
      <HeaderWrapper>
        <WelcomeText type={'h2'}>Hi there! </WelcomeText>
        <Text type={'p'}>This is an example of how customers experience chat on your website</Text>
      </HeaderWrapper>
    )
  }
};

Header.defaultProps = {
  headerConfig: {}
}

function Header({ headerConfig }){

  const config = Object.assign({}, defaultHeaderConfig, headerConfig);

  if(config.isHTML){
    return renderHTML(config.render());
  }else{
    return config.render();
  }
}

const textInputRef = React.createRef();
const HEADER_HEIGHT = 115;

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transcript: [],
      typingParticipants: [],
      contactStatus: CONTACT_STATUS.DISCONNECTED,
      parentHeaderWrapperHeight: HEADER_HEIGHT,
    };
    this.parentHeaderRef = React.createRef();
    this.updateTranscript = transcript => this.setState({transcript: [...transcript]});
    this.updateTypingParticipants = typingParticipants => this.setState({typingParticipants});
    this.updateContactStatus = contactStatus => this.setState({contactStatus});
    if(window.connect && window.connect.LogManager) {
      this.logger = window.connect.LogManager.getLogger({ prefix: "ChatInterface-Chat" });
    }
  }

  static propTypes = {
    chatSession: PT.object.isRequired,
    composerConfig: PT.object,
    onEnded: PT.func,
  };

  static defaultProps = {
    onEnded: () => {},
  };

  resetChatHeight() {
    this.setState({
      parentHeaderWrapperHeight: this.parentHeaderRef && this.parentHeaderRef.current ? this.parentHeaderRef.current.clientHeight : HEADER_HEIGHT,
    });
  }

  componentDidMount() {
    this.init(this.props.chatSession);
    this.resetChatHeight();
    this.logger && this.logger.info("Component mounted.")
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatSession !== this.props.chatSession) {
      this.cleanUp(prevProps.chatSession);
      this.init(this.props.chatSession);
    }
  }

  componentWillUnmount() {
    this.cleanUp(this.props.chatSession);
  }

  init(chatSession) {
    this.setState({contactStatus: chatSession.contactStatus});
    chatSession.on('transcript-changed', this.updateTranscript);
    chatSession.on('typing-participants-changed', this.updateTypingParticipants);
    chatSession.on('contact-status-changed', this.updateContactStatus);
  }

  cleanUp(chatSession) {
    chatSession.off('transcript-changed', this.updateTranscript);
    chatSession.off('typing-participants-changed', this.updateTypingParticipants);
    chatSession.off('contact-status-changed', this.updateContactStatus);
  }

  endChat() {
    this.props.chatSession.endChat();
    this.props.onEnded();
  }

  closeChat() {
    this.props.chatSession.closeChat();
    this.props.onEnded();
  }
/*
  Note: For Mobile layout: divided into 3 sections
  1. Header - Positon: absolute; top: 0, left: 0, right: 0 - height is dynamic!
  2. MainContent - Position: absolute; top: {dynamicHeight}, left: 0, right: 0, bottom: {fixedFooterHeight: 85px}
  3. Footer - position: absolute; bottom: 0, right: 0, left: 0
  -- this prevents overlay from overflowing in mobile browser. 
*/
  render() {
    const {chatSession, headerConfig, transcriptConfig, composerConfig, footerConfig } = this.props;
    console.log('MESSAGES', this.state.transcript);

    return (
        <>
            <ChatActionBar
                onEndChat={() => this.endChat()}
                onClose={() => this.closeChat()}
                contactStatus={this.state.contactStatus}
                footerConfig={footerConfig}
            />
            <ChatWrapper data-testid="amazon-connect-chat-wrapper">
                <ChatComposerWrapper
                    parentHeaderWrapperHeight={
                        this.state.parentHeaderWrapperHeight
                    }
                >
                    <ChatTranscriptor
                        loadPreviousTranscript={() =>
                            chatSession.loadPreviousTranscript()
                        }
                        addMessage={(data) =>
                            chatSession.addOutgoingMessage(data)
                        }
                        downloadAttachment={(attachmentId) =>
                            chatSession.downloadAttachment(attachmentId)
                        }
                        transcript={this.state.transcript}
                        typingParticipants={this.state.typingParticipants}
                        contactStatus={this.state.contactStatus}
                        contactId={chatSession.contactId}
                        transcriptConfig={transcriptConfig}
                        textInputRef={textInputRef}
                        sendReadReceipt={(...inputParams) =>
                            chatSession.sendReadReceipt(...inputParams)
                        }
                    />
                    <ChatComposer
                        contactStatus={this.state.contactStatus}
                        contactId={chatSession.contactId}
                        addMessage={(contactId, data) =>
                            chatSession.addOutgoingMessage(data)
                        }
                        addAttachment={(contactId, attachment) =>
                            chatSession.addOutgoingAttachment(attachment)
                        }
                        onTyping={() => chatSession.sendTypingEvent()}
                        composerConfig={composerConfig}
                        textInputRef={textInputRef}
                    />
                </ChatComposerWrapper>
            </ChatWrapper>
        </>
    );
  }
}
