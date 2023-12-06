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
        return `${name} has joined the chat`;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_IDLE:
        return `${name} has become idle`;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_DISCONNECT:
        return `${name} has been idle too long, disconnecting`;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_RETURNED:
        return `${name} has returned`;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT:
        return `${name} has left the chat`;
      case ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED:
        return `Chat has ended!`;
      default:
        return "";
    }
  };

  render() {
    return <>{this.getMessageText()}</>;
  }
}