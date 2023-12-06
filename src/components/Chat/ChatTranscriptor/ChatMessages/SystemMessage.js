// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import PT from "prop-types";
import { ContentType } from "../../datamodel/Model";

export class SystemMessage extends React.PureComponent {
  static propTypes = {
    messageDetails: PT.object.isRequired
  };

  static defaultProps = {};

  getMessageText = () => {
    let name = this.props.messageDetails.displayName;
    switch (this.props.messageDetails.content.type) {
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_JOINED:
        return <FormattedMessage
          id="transcriptor.joinedChat"
          defaultMessage="{name} has joined the chat"
          values={{
            name
          }}
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

      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT:
        return <FormattedMessage
          id="transcriptor.leftChat"
          defaultMessage="{name} has left the chat"
          values={{
            name
          }}
        />;
      case ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED:
        return <FormattedMessage
          id="transcriptor.endChat"
          defaultMessage="Chat has ended!"
        />;
      default:
        return "";
    }
  };

  render() {
    return <>{this.getMessageText()}</>;
  }
}