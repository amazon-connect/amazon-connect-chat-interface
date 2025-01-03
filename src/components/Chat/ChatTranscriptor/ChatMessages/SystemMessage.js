// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import { FormattedMessage } from "react-intl";
import PT from "prop-types";
import { ContentType } from "../../datamodel/Model";
import { AuthenticationMessage } from './AuthenticationMessage'
export class SystemMessage extends React.PureComponent {
  static propTypes = {
    messageDetails: PT.object.isRequired,
    authenticationUrl: PT.string
  };

  static defaultProps = {};

  getMessageText = () => {
    console.log("SystemMessage getMessageText");
    console.log(this.props);
    let name = this.props.messageDetails.displayName;
    const type = this.props.messageDetails.content.type;
    const content = this.props.messageDetails.content;
    switch (type) {
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_JOINED:
        name = this.props.messageDetails.displayName;
        return <FormattedMessage
          id="transcriptor.joinedChat"
          defaultMessage="{name} has joined the chat"
          values={{
            name
          }}
      />;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT:
        name = this.props.messageDetails.displayName;
        return <FormattedMessage
            id="transcriptor.leftChat"
            defaultMessage="{name} has left the chat"
            values={{
              name
            }}
        />;
      case ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED:
        return <AuthenticationMessage link={this.props.messageDetails.authenticationUrl} content={content} ></AuthenticationMessage>
      case ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_EXPIRED:
      case ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_FAILED:
      case ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_SUCCESSFUL:
      case ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_TIMEOUT:
      case ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_CANCELLED:
        return <AuthenticationMessage content={content}></AuthenticationMessage>
      case ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED:
        return <FormattedMessage
            id="transcriptor.endChat"
            defaultMessage="Chat has ended!"
        />;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_IDLE:
        return <FormattedMessage
            id="transcriptor.idleChat"
            defaultMessage="{name} has become idle"
            values={{
              name
            }}
        />;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_DISCONNECT:
        return <FormattedMessage
            id="transcriptor.disconnectChat"
            defaultMessage="{name} has been idle too long, disconnecting"
            values={{
              name
            }}
        />;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_RETURNED:
        return <FormattedMessage
            id="transcriptor.returnedChat"
            defaultMessage="{name} has returned"
            values={{
              name
            }}
        />;

      default:
        return "";
    }
  };

  render() {
    return <>{this.getMessageText()}</>;
  }
}