// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import PT from "prop-types";
import styled from "styled-components";
import { modelUtils } from "../datamodel/Utils";
import { PARTICIPANT_MESSAGE, Direction } from "../datamodel/Model";
import renderHTML from 'react-render-html';
import {
  MessageBox,
  ParticipantMessage,
  ParticipantTyping,
} from "./ChatMessages/ChatMessage";
import ChatTranscriptScroller from "./ChatTranscriptScroller";
import { SystemMessage } from "./ChatMessages/SystemMessage";
import { CONTACT_STATUS } from "connect-constants";


const TranscriptBody = styled.div`
  margin: 0 auto;
`;

const TranscriptWrapper = styled(ChatTranscriptScroller)`
  order: 2;
  flex: 1 1 0;
  background: ${props =>
    (props.type === CONTACT_STATUS.ACW ||
      props.type === CONTACT_STATUS.CONNECTED) &&
    props.theme.palette.white};
`;

const defaultTranscriptConfig = {

  participantMessageConfig: {
    render: ({...props}) => {
      return <ParticipantMessage {...props} />;
    }
  },

  systemMessageConfig: {
    render: ({...props}) => {
      return <SystemMessage {...props} />;
    }
  }
};


export default class ChatTranscriptor extends PureComponent {
  static propTypes = {
    contactId: PT.string.isRequired,
    transcript: PT.array,
    typingParticipants: PT.array.isRequired,
    contactStatus: PT.string.isRequired,
    loadPreviousTranscript: PT.func.isRequired

  };

  loadTranscript = () => {
    console.log("CCP", "ChatTranscriptor - transcriptLoading true");
    return this.props.loadPreviousTranscript().then((data) => {
      console.log("CCP", "ChatTranscriptor - transcript Loading complete");
      return data;
    });
  };

  renderMessage = itemDetails => {
    var itemId = itemDetails.id;
    var version = itemDetails.version;
    var key = itemId + "." + version;
    console.log(itemDetails);

    const transcriptConfig = Object.assign({}, defaultTranscriptConfig, this.props.transcriptConfig);

    const {participantMessageConfig, systemMessageConfig, render, isHTML} = transcriptConfig;

    if (itemDetails.type === PARTICIPANT_MESSAGE) {
      console.log("renderMessage itemDetails ParticipantMessage");
      let content = "";

      if(render){
        content = render({
          key: key,
          messageDetails: itemDetails
        });
      }

      if(!content && participantMessageConfig && participantMessageConfig.render){
        content = participantMessageConfig.render({
          key: key,
          messageDetails: itemDetails
        })
      }

      return <MessageBox key={itemId}>
        {(participantMessageConfig.isHTML || isHTML) && renderHTML(content)}
        {!(participantMessageConfig.isHTML || isHTML) && content}
      </MessageBox>

     
    } else if (modelUtils.isRecognizedEvent(itemDetails.content.type)) {
      console.log("renderMessage itemDetails SystemMessage");


      let content = "";

      if(render){
        content = render({
          key: key,
          itemDetails: itemDetails
        });
      }


      if(!content && systemMessageConfig && systemMessageConfig.render){

        content = systemMessageConfig.render({
          key: key,
          itemDetails: itemDetails
        });
      }


      if(systemMessageConfig.isHTML || isHTML){
        return renderHTML(content);
      }
      return content;
    } else {
      return <React.Fragment />;
    }
  };

  renderTyping = participantTypingDetails => {
    var participantId =
      participantTypingDetails.participantId;
    var displayName = participantTypingDetails.displayName;
    var direction = participantTypingDetails.direction;
    return (
      <ParticipantTyping
        key={participantId}
        displayName={displayName}
        direction={direction}
      />
    );
  };

  render() {
    const lastSentMessage = this.props.transcript
      .filter(({ type, transportDetails }) => (
        type === PARTICIPANT_MESSAGE &&
        transportDetails.direction === Direction.Outgoing
      )).pop();

    return (
      <TranscriptWrapper
        contactId={this.props.contactId}
        type={this.props.contactStatus}
        loadPreviousTranscript={this.loadTranscript}
        lastSentMessageId={lastSentMessage ? lastSentMessage.id : null}
      >
        {(this.props.contactStatus === CONTACT_STATUS.CONNECTED ||
          this.props.contactStatus === CONTACT_STATUS.ACW ||
          this.props.contactStatus === CONTACT_STATUS.ENDED) && (
            <TranscriptBody>
              {this.props.transcript.map(item => this.renderMessage(item))}
              {this.props.typingParticipants.map(typing =>
                this.renderTyping(typing)
              )}
            </TranscriptBody>
          )}
      </TranscriptWrapper>
    );
  }
}
