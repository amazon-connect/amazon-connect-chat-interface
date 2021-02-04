// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import styled from "styled-components";
import PT from "prop-types";
import Linkify from "react-linkify";
import { Status, Direction } from "../../datamodel/Model";
import { FormattedMessage } from "react-intl";
import { Icon, TypingLoader } from "connect-core";
import { ContentType } from "../../datamodel/Model";
import { InteractiveMessage } from "./InteractiveMessage";

export const MessageBox = styled.div`
  padding: ${({ theme }) => theme.globals.basePadding}
    ${({ theme }) => theme.spacing.base};
  word-break: break-word;
  white-space: pre-line;
  overflow: auto;
  text-align: ${props => props.textAlign};
`;
const Header = styled.div`
  overflow: auto;
`;
Header.Sender = styled.div`
  float: left;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
Header.Status = styled.div`
  float: right;
`;
const Body = styled.div`
  ${props =>
    props.direction === Direction.Outgoing
      ? props.theme.chatTranscriptor.outgoingMsg
      : props.theme.chatTranscriptor.incomingMsg};

  ${props =>
      props.messageStyle ? props.messageStyle : ""};

  padding: ${props => props.removePadding ? 0 : props.theme.spacing.base};
  margin-top: ${props => props.theme.spacing.mini};
  border-radius: 5px;
  position: relative;
  &:after{
    display: ${props => props.hideDirectionArrow ? "none" : "block" };
    ${props =>
      props.direction === Direction.Outgoing
        ? `
      content: " ";
      position: absolute;
      right: -6px;
      bottom: 4px;
      border-radius: 2px;
      border-left: 12px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 9px solid ${props.theme.chatTranscriptor.outgoingMsgBg};
    `
        : `
      content: " ";
      position: absolute;
      left: -6px;
      bottom: 4px;
      border-radius: 2px;
      border-left: 10px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 9px solid ${props.theme.chatTranscriptor.incomingMsgBg};`}
  }
`;
const ErrorText = styled.div`
  color: ${({ theme }) => theme.palette.red};
  display: flex;
  > img {
    margin-right: ${({ theme }) => theme.spacing.mini};
  }
`;
const StatusText = styled.span`
  color: ${({ theme }) => theme.globals.textSecondaryColor};
  padding-right: ${({ theme }) => theme.spacing.mini};
`;

export class ParticipantMessage extends PureComponent {
  static propTypes = {
    messageDetails: PT.object.isRequired,
    incomingMsgStyle:  PT.object,
    mediaOperations: PT.object,
    outgoingMsgStyle: PT.object,
    isLatestMessage: PT.bool,
  };

  timestampToDisplayable(timestamp) {
    var d = new Date(0);
    d.setUTCSeconds(timestamp);
    return d.toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'});
  }

  renderHeader() {
    var displayName =
      this.props.messageDetails.displayName;
    var transportDetails = this.props.messageDetails.transportDetails;
    var isOutgoingMsg = this.props.messageDetails.transportDetails.direction === Direction.Outgoing;
    var statusStringPrefix = "connect-chat-transport-status-";
    var transportStatusElement = <React.Fragment />;
    switch (transportDetails.status) {
      case Status.Sending:
        transportStatusElement = (
          <React.Fragment>
            <StatusText>
              <FormattedMessage
                id={statusStringPrefix + "sending"}
                defaultMessage="Sending at"
              />
            </StatusText>
          </React.Fragment>
        );
        break;
      case Status.SendSuccess:
        transportStatusElement = (
          <React.Fragment>
            {isOutgoingMsg && <StatusText>
                <FormattedMessage
                  id={statusStringPrefix + "sent"}
                  defaultMessage="Sent at"
                />
              </StatusText>
            }            
            {this.timestampToDisplayable(transportDetails.sentTime)}
          </React.Fragment>
        );
        break;
      case Status.SendFailed:
        transportStatusElement = (
          <ErrorText>
            <Icon />
            <FormattedMessage
              id={statusStringPrefix + "sendFailed"}
              defaultMessage="Failed to send! "
            />
          </ErrorText>
        );
        break;
      default:
        transportStatusElement = <React.Fragment />;
    }
    return (
      <React.Fragment>
        <Header.Sender>{displayName}</Header.Sender>
        <Header.Status>{transportStatusElement}</Header.Status>
      </React.Fragment>
    );
  }

  render() {
    let { direction } = this.props.messageDetails.transportDetails;
    const messageStyle = direction === Direction.Outgoing ? this.props.outgoingMsgStyle : this.props.incomingMsgStyle;

    const bodyStyleConfig = {};
    if (this.props.isLatestMessage &&
        this.props.messageDetails.content.type === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE) {
      bodyStyleConfig.hideDirectionArrow = true;
      bodyStyleConfig.removePadding = true;
    }

    return (
        <React.Fragment>
          <Header>{this.renderHeader()}</Header>
          <Body direction={direction} messageStyle={messageStyle} {...bodyStyleConfig}>
            {this.renderContent()}
          </Body>
        </React.Fragment>
    );
  }

  renderContent() {
    var content = this.props.messageDetails.content.data;
    let textContent = content;
    if(this.props.messageDetails.content.type === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE) {
      const {data, templateType} = JSON.parse(content);
      if(this.props.isLatestMessage) {
        return <InteractiveMessage content={data.content} templateType={templateType}
                                   addMessage={this.props.mediaOperations.addMessage}
                                   />
      }
      textContent = data.content.title;
    }
    return <PlainTextMessage content={textContent}/>;
  }
}

class PlainTextMessage extends PureComponent {
  render() {
    return (
      <Linkify properties={{ target: "_blank" }}>{this.props.content}</Linkify>
    );
  }
}

const ParticipantTypingBox = styled(MessageBox)`
  > ${Body}{
    display: inline-block;
    float: ${props =>
      props.direction === Direction.Outgoing ? "right" : "left"}
`;

export class ParticipantTyping extends PureComponent {
  render() {
    return (
      <ParticipantTypingBox direction={this.props.direction}>
        <Body direction={this.props.direction}>
          <TypingLoader
            color={
              this.props.direction === Direction.Outgoing ? "#fff" : "#000"
            }
          />
        </Body>
      </ParticipantTypingBox>
    );
  }
}
