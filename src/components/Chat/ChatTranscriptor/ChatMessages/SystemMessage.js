// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import PT from "prop-types";
import styled from "styled-components";
import { MessageBox } from "./ChatMessage";
import { ContentType } from "../../datamodel/Model";

const SystemMessageBox = styled(MessageBox)`
  text-align: center;
`;

export class SystemMessage extends PureComponent {
  static propTypes = {
    itemDetails: PT.object.isRequired
  };

  static defaultProps = {};

  getMessageText = () => {
    console.log("SystemMessage getMessageText");
    console.log(this.props);
    let name  = "";
    switch (this.props.itemDetails.content.type) {
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_JOINED:
        name = this.props.itemDetails.displayName;
        return name + " has joined the chat";
      case ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT:
        name = this.props.itemDetails.displayName;
        return name + " has left the chat";
      case ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED:
        return "Chat has ended!";

      default:
        return "";
    }
  };

  render() {
    return <SystemMessageBox>{this.getMessageText()}</SystemMessageBox>;
  }
}
