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
    console.log("SystemMessage getMessageText");
    console.log(this.props);
    let name = this.props.messageDetails.displayName;
    switch (this.props.messageDetails.content.type) {
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_JOINED:
        name = this.props.messageDetails.displayName;
        return name + " has joined the chat";
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT:
        name = this.props.messageDetails.displayName;
        return name + " has left the chat";
      case ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED:
        return "Chat has ended!";
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_IDLE:
        return `${name} has become idle`;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_DISCONNECT:
        return `${name} has been idle too long, disconnecting`;
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_RETURNED:
        return `${name} has returned`;

      default:
        return "";
    }
  };

  render() {
    return <>{this.getMessageText()}</>;
  }
}