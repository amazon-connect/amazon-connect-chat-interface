// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import styled from "styled-components";
import PT from "prop-types";
import Linkify from "react-linkify";
import {
  ATTACHMENT_MESSAGE,
  AttachmentStatus,
  ContentType,
  Status,
  Direction,
  InteractiveMessageType,
} from "../../datamodel/Model";
import { ErrorBoundary } from 'react-error-boundary';
import { Icon, TypingLoader } from "connect-core";
import { InteractiveMessage } from "./InteractiveMessage";
import { CSM_CONSTANTS, CSM_CATEGORY } from "../../../../constants/global";
import { InView } from "react-intersection-observer";
import { shouldDisplayMessageForType } from "../../../../utils/helper";
import { modelUtils } from "../../datamodel/Utils";
import { RichMessageRenderer } from "../../RichMessageComponents";
import { formatCarouselInteractiveSelection, isCarouselSelectionMessage } from "./InteractiveMessages/Carousel";

export const MessageBox = styled.div`
  padding: ${({ theme }) => theme.globals.basePadding} ${({ theme }) => theme.spacing.base};
  word-break: break-word;
  white-space: pre-line;
  overflow: auto;
  text-align: ${(props) => props.textAlign};
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
const Footer = styled.div`
  overflow: auto;
  color: ${({ theme }) => theme.globals.textSecondaryColor};
  padding-right: ${({ theme }) => theme.spacing.mini};
`;
Footer.MessageReceipt = styled.div`
  float: right;
`;

const Body = styled.div`
  ${(props) =>
    props.direction === Direction.Outgoing
      ? props.theme.chatTranscriptor.outgoingMsg
      : props.theme.chatTranscriptor.incomingMsg};

  ${(props) => (props.messageStyle ? props.messageStyle : "")};

  ${(props) => props.childWillAddBackground ? "background: none" : ""}

  padding: ${(props) => (props.removePadding ? 0 : props.theme.spacing.base)};
  margin-top: ${(props) => props.theme.spacing.mini};
  border-radius: 5px;
  position: relative;
  &:after {
    display: ${(props) => (props.hideDirectionArrow ? "none" : "block")};
    ${(props) =>
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

const TransportErrorMessage = styled.div`
  margin-left: ${(props) => props.theme.chatTranscriptor.msgStatusWidth};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.micro};

  span {
    color: ${({ theme }) => theme.palette.red};
  }
`;

TransportErrorMessage.RetryButton = styled.a`
  margin-left: ${({ theme }) => theme.spacing.micro};
`;

export const ErrorFallback = ({ error, resetErrorBoundary, InteractiveMessageType }) => {
  const metricName = InteractiveMessageType + "_ERROR"
  if (window.connect && window.connect.csmService) {
    window.connect.csmService.addCountAndErrorMetric(metricName, CSM_CATEGORY.UI, false);
  }
  console.warn("Render Error for:", error);
  return (
    <div role="alert">
      <p>Something went wrong</p>
      <button onClick={resetErrorBoundary}>Reload Editor</button>
    </div>
  )
}

export class ParticipantMessage extends PureComponent {
  static propTypes = {
    messageDetails: PT.object.isRequired,
    incomingMsgStyle: PT.object,
    outgoingMsgStyle: PT.object,
    mediaOperations: PT.object,
    isLatestMessage: PT.bool,
    shouldShowMessageReceipts: PT.bool,
    sendReadReceipt: PT.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      inView: false,
      isVisible: false,
    };
    this.csmService = undefined
    if (window.connect && window.connect.csmService) {
      this.csmService = window.connect.csmService;
    }
  }

  timestampToDisplayable(timestamp) {
    const d = new Date(0);
    d.setUTCSeconds(timestamp);
    const today = new Date().toDateString();
    const thatDay = new Date(timestamp * 1000).toDateString();
    const option = { hour: "numeric", minute: "numeric" };
    if (today === thatDay) {
      return d.toLocaleTimeString([], option);
    }
    return d.toLocaleTimeString([], {
      ...option,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  renderHeader() {
    const isOutgoingMsg = this.props.messageDetails.transportDetails.direction === Direction.Outgoing;
    const displayName = this.props.messageDetails.displayName || (isOutgoingMsg ? "Customer" : "Agent");
    const transportDetails = this.props.messageDetails.transportDetails;

    let transportStatusElement = <React.Fragment />;
    switch (transportDetails.status) {
      case Status.Sending:
        transportStatusElement = (
          <React.Fragment>
            <StatusText>
              <span>Sending</span>
            </StatusText>
          </React.Fragment>
        );
        break;
      case Status.SendSuccess:
        transportStatusElement = <React.Fragment>{this.timestampToDisplayable(transportDetails.sentTime, isOutgoingMsg)}</React.Fragment>;
        break;
      case Status.SendFailed:
        transportStatusElement = (
          <ErrorText>
            <Icon />
            <span>Failed to send!</span>
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

  renderMessageReceipts() {
    const {
      messageDetails: {
        lastReadReceipt = false,
        lastDeliveredReceipt = false,
        transportDetails: { messageReceiptType, direction } = {},
      },
    } = this.props;
    if (direction !== Direction.Outgoing || !messageReceiptType) {
      return null;
    }
    return (
      <React.Fragment>
        <Footer.MessageReceipt>
          {lastReadReceipt && "Read"}
          {lastDeliveredReceipt && "Delivered"}
        </Footer.MessageReceipt>
      </React.Fragment>
    );
  }

  visibilityChangeListener() {
    const isVisible = document.visibilityState === "visible";
    this.setState({ isVisible });
  }

  componentDidUpdate() {
    const {
      transportDetails: { direction },
      type,
      id,
      participantRole,
    } = this.props.messageDetails;
    //Note: type valid values: https://docs.aws.amazon.com/connect-participant/latest/APIReference/API_Item.html#connectparticipant-Type-Item-Type
    if (
      this.state.inView &&
      this.state.isVisible &&
      modelUtils.isTypeMessageOrAttachment(type) &&
      modelUtils.isParticipantAgentOrCustomer(participantRole) &&
      direction === Direction.Incoming
    ) {
      this.props.sendReadReceipt(
        id,
        type === ATTACHMENT_MESSAGE ? { disableThrottle: true } : {},
      );
    }
  }

  componentDidMount() {
    //Bug-Fix: In Firefox react-intersection-observer is not able to identify if a page is active or minimized.
    this.visibilityChangeListener();
    document.addEventListener(
      "visibilitychange",
      this.visibilityChangeListener.bind(this),
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "visibilitychange",
      this.visibilityChangeListener.bind(this),
    );
  }

  render() {
    let { direction, error } = this.props.messageDetails.transportDetails;
    const messageStyle =
      direction === Direction.Outgoing
        ? this.props.outgoingMsgStyle
        : this.props.incomingMsgStyle;

    //Hack to simulate ChatJS response with attachment content types
    const bodyStyleConfig = {};
    if (
      this.props.isLatestMessage &&
      this.props.messageDetails.content &&
      this.props.messageDetails.content.type ===
        ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE
    ) {
      bodyStyleConfig.hideDirectionArrow = true;
      bodyStyleConfig.removePadding = true;

      const { templateType } = JSON.parse(this.props.messageDetails.content.data);
      if (templateType === InteractiveMessageType.QUICK_REPLY || templateType === InteractiveMessageType.CAROUSEL) {
        bodyStyleConfig.childWillAddBackground = true;
      }
    }
    let content, contentType;
    if (this.props.messageDetails.type === ATTACHMENT_MESSAGE) {
      //Use Attachments data as content if available
      //If an attachment message does not have this data, it means the upload was rejected
      if (
        this.props.messageDetails.Attachments &&
        this.props.messageDetails.Attachments.length > 0
      ) {
        content = this.props.messageDetails.Attachments[0];
        contentType = content.ContentType;
      } else {
        content = {
          AttachmentName: this.props.messageDetails.content.name,
        };
        contentType = this.props.messageDetails.content.type;
      }
    } else {
      content = this.props.messageDetails.content.data;
      contentType = this.props.messageDetails.content.type;
      if (!shouldDisplayMessageForType(contentType)) {
        return null;
      }
    }

    return (
      <div data-testid="main-message">
        <Header data-testid="message-header">{this.renderHeader()}</Header>
        <InView onChange={(inView) => this.setState({ inView })}>
          {({ ref }) => (
            <Body
              data-testid="message-body"
              direction={direction}
              messageStyle={messageStyle}
              {...bodyStyleConfig}
              ref={this.props.isLatestMessage ? ref : null}
            >
              {this.renderContent(content, contentType)}
            </Body>
          )}
        </InView>
        <Footer>
          {this.renderMessageReceipts()}
        </Footer>
        {error && this.renderTransportError(error)}
      </div>
    );
  }
  
  triggerCountMetric(csmType) {
    if (this.csmService) {
      this.csmService.addCountMetric(csmType, CSM_CATEGORY.UI);
    }
  }

  renderContent(content, contentType) {
    if (this.props.messageDetails.type === ATTACHMENT_MESSAGE) {
      return (
        <AttachmentMessage
          content={content}
          downloadAttachment={this.props.mediaOperations.downloadAttachment}
        />
      );
    }
    
    if (contentType === ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE) {
      const { data, templateType } = JSON.parse(content);
      if (this.props.isLatestMessage) {
        this.triggerCountMetric(templateType + CSM_CONSTANTS.RENDER_INTERACTIVE_MESSAGE)
        return (
          <ErrorBoundary fallback={<ErrorFallback InteractiveMessageType={templateType}/>} >
            <InteractiveMessage
              content={data.content}
              templateType={templateType}
              addMessage={this.props.mediaOperations.addMessage}
              textInputRef={this.props.textInputRef}
            />
          </ErrorBoundary>
        )
      }
      this.triggerCountMetric(CSM_CONSTANTS.RENDER_RICH_MESSAGE)
      return <RichMessageRenderer content={data.content.title} />
    }
    if (contentType === ContentType.MESSAGE_CONTENT_TYPE.TEXT_MARKDOWN) {
      this.triggerCountMetric(CSM_CONSTANTS.RENDER_RICH_MESSAGE)
      return <RichMessageRenderer content={content} />
    }
    this.triggerCountMetric(CSM_CONSTANTS.RENDER_PLAIN_MESSAGE)
    if (isCarouselSelectionMessage(content)) {
      const carouselAndNestedPickerTitle = formatCarouselInteractiveSelection(content);
      return <PlainTextMessage content={carouselAndNestedPickerTitle} />
    }

    return <PlainTextMessage content={content} />
  }

  renderTransportError(error) {
    if (!error || !error.message) {
      return null;
    }
    return (
      <TransportErrorMessage>
        <span>{error.message}</span>
        {error.retry && this.renderRetryButton(error.retry)}
      </TransportErrorMessage>
    );
  }

  renderRetryButton(callback) {
    const onRetry = (e) => {
      e.preventDefault();
      callback();
    };

    return (
      <TransportErrorMessage.RetryButton
        href={"Retry"}
        tabIndex={0}
        onClick={onRetry}
        onKeyPress={onRetry}
      >
        Retry
      </TransportErrorMessage.RetryButton>
    );
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

class AttachmentMessage extends PureComponent {
  downloadAttachment = (e) => {
    e.preventDefault();
    if (!this.props.content.AttachmentId) {
      return;
    }
    this.props
      .downloadAttachment(this.props.content.AttachmentId)
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", this.props.content.AttachmentName);
        link.click();
      });
  };

  renderContent() {
    if (this.props.content.Status === AttachmentStatus.APPROVED) {
      return (
        <a
          href={this.props.content.AttachmentName}
          onClick={this.downloadAttachment}
          onKeyPress={this.downloadAttachment}
        >
          {this.props.content.AttachmentName}
        </a>
      );
    }
    return this.props.content.AttachmentName;
  }

  render() {
    if (!this.props.content) {
      return;
    }

    return <div>{this.renderContent()}</div>;
  }
}
