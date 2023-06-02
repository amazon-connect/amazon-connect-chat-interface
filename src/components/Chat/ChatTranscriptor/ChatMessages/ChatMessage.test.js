// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ParticipantMessage, ErrorFallback } from "./ChatMessage";
import { ThemeProvider } from "../../../../theme";
import { CSM_CONSTANTS, CSM_CATEGORY } from "../../../../constants/global";
import { ContentType, InteractiveMessageType } from "../../datamodel/Model";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import { screen, within } from "@testing-library/dom";
import { mockListPickerData } from './InteractiveMessages/ListPicker.test.js';
import { mockCarouselContent } from "./InteractiveMessages/Carousel.test";
import { mockQuickReplyContent } from "./InteractiveMessages/QuickReply.test";

describe("ChatMessage", () => {
  beforeAll(() => {
    mockAllIsIntersecting(true);
    window.connect = {
      csmService: {
        addCountMetric: jest.fn().mockImplementation(() => {}),
        addCountAndErrorMetric: jest.fn().mockImplementation(() => {})
      },
    };
    // set system date to 10/4/2022
    jest.useFakeTimers().setSystemTime(new Date(1664900925 * 1000));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const renderComponent = (customMessage, customProps = {}) => {
    const mockProps = {
      key: "key",
      messageDetails: {
        id: "messageId",
        type: "MESSAGE",
        displayName: "name",
        participantId: "participantId",
        participantRole: "CUSTOMER",
        transportDetails: {
          status: "SendFailed",
          direction: "Outgoing",
          sentTime: 1660865275,
        },
        version: null,
        ...customMessage
      },
      textInputRef: React.createRef(),
      isLatestMessage: false,
      mediaOperations: {
        addMessage: jest.fn(),
        downloadAttachment: jest.fn(),
      },
      sendReadReceipt: jest.fn(),
      ...customProps
    };

    render(
      <ThemeProvider>
        <ParticipantMessage {...mockProps} />
      </ThemeProvider>
    );
  }

  
  it('ErrorFallback renders correctly', () => {
    const resetErrorBoundary = jest.fn();
    const error = new Error('Test error');

    const { getByText } = render(
      <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    );
  
    expect(getByText(/something went wrong/i)).toBeInTheDocument();
  });
  it("should call csmService addCount when PlainTextMessage component is rendered", () => {
    renderComponent({
      content: {
        data: "data",
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN
      }
    });
    expect(window.connect.csmService.addCountMetric).toBeCalledWith(
      CSM_CONSTANTS.RENDER_PLAIN_MESSAGE,
      CSM_CATEGORY.UI,
    );
  });

  it("should call csmService addCount when rich message component is rendered", () => {
    renderComponent({
      content: {
        data: "data",
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_MARKDOWN
      }
    });
    expect(window.connect.csmService.addCountMetric).toBeCalledWith(
      CSM_CONSTANTS.RENDER_RICH_MESSAGE,
      CSM_CATEGORY.UI,
    );
  });

  it("should call csmService addCount when interactive component is rendered", () => {
    renderComponent({
      content: {
        data: mockListPickerData,
        type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE,
      }
    }, { isLatestMessage: true });
    
    expect(window.connect.csmService.addCountMetric).toBeCalledWith(
      InteractiveMessageType.LIST_PICKER + CSM_CONSTANTS.RENDER_INTERACTIVE_MESSAGE,
      CSM_CATEGORY.UI,
    );
  });

  it("should call csmService addCount when interactive component is rendered in transcript", () => {
    renderComponent({
      content: {
        data: mockListPickerData,
        type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE,
      }
    }, { isLatestMessage: false });
    
    expect(window.connect.csmService.addCountMetric).toBeCalledWith(
      CSM_CONSTANTS.RENDER_RICH_MESSAGE,
      CSM_CATEGORY.UI,
    );
  });

  it("should show short date format if message is sent in current day", () => {
    const timeStamp = 1664900925; // 10/4/2022
    renderComponent({
      transportDetails: {
        status: "SendSuccess",
        direction: "Outgoing",
        sentTime: timeStamp,
      },
      content: {
        data: "data",
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
      },
    });

    const { getByText } = within(screen.getByTestId("message-header"));
    expect(getByText("4:28 PM")).toBeInTheDocument();
  });

  it("should show long date format if message is not sent in current day", () => {
    const timeStamp = 1654950925; // 6/11/2022
    renderComponent({
      transportDetails: {
        status: "SendSuccess",
        direction: "Outgoing",
        sentTime: timeStamp,
      },
      content: {
        data: "data",
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
      },
    });

    const { getByText } = within(screen.getByTestId("message-header"));
    expect(getByText("Sat, Jun 11, 12:35 PM")).toBeInTheDocument();
  });

  it("should not render message if message content type is not valid", async () => {
    renderComponent({
      content: {
        data: "data",
        type: "application/json",
      },
    });

    const message = await screen.queryByTestId("main-message");
    expect(message).toBeNull();
  });

  describe("InteractiveMessage", () => {
    it("should properly apply background styling for QuickReply interactive message", () => {
      renderComponent({
        transportDetails: {
          status: "SendSuccess",
          direction: "Incoming",
          sentTime: 1654950925, // 6/11/2022
        },
        content: {
          data: JSON.stringify({  templateType: "QuickReply", version: "1.0", data: { content: mockQuickReplyContent }}),
          type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE,
        },
      }, { isLatestMessage: true });

      // Verify the background was removed for parent message body
      const messageBodyStyles = window.getComputedStyle(screen.getByTestId('message-body'));
      expect(messageBodyStyles.backgroundColor).toBeFalsy();
      const messageResponseSectionStyles = window.getComputedStyle(screen.getByTestId('interactive-quickreply-response-section'));
      expect(messageResponseSectionStyles.backgroundColor).toBeFalsy();

      // Verify the background is now added to message bubble and nested pickers
      const messageTitleStyles = window.getComputedStyle(screen.getByTestId('interactive-quickreply-message-title'));
      expect(messageTitleStyles.backgroundColor).toBe('rgb(237, 237, 237)');
    });

    it("should apply default background styling for QuickReply interactive message (when isLatestMessage = false)", () => {
      renderComponent({
        transportDetails: {
          status: "SendSuccess",
          direction: "Incoming",
          sentTime: 1654950925, // 6/11/2022
        },
        content: {
          data: JSON.stringify({  templateType: "QuickReply", version: "1.0", data: { content: mockQuickReplyContent }}),
          type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE,
        },
      }, { isLatestMessage: false });

      // Verify the background was removed for parent message body
      const messageBodyStyles = window.getComputedStyle(screen.getByTestId('message-body'));
      expect(messageBodyStyles.backgroundColor).toBe('rgb(237, 237, 237)');
    });

    it("should properly apply background styling for Carousel interactive message", () => {
      renderComponent({
        transportDetails: {
          status: "SendSuccess",
          direction: "Incoming",
          sentTime: 1654950925, // 6/11/2022
        },
        content: {
          data: JSON.stringify({  templateType: "Carousel", version: "1.0", data: { content: mockCarouselContent }}),
          type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE,
        },
      }, { isLatestMessage: true });

      // Verify the background was removed for parent message body
      const messageBodyStyles = window.getComputedStyle(screen.getByTestId('message-body'));
      expect(messageBodyStyles.backgroundColor).toBeFalsy();
      const messageResponseSectionStyles = window.getComputedStyle(screen.getByTestId('interactive-carousel-response-section'));
      expect(messageResponseSectionStyles.backgroundColor).toBeFalsy();

      // Verify the background is now added to message bubble and nested pickers
      const messageTitleStyles = window.getComputedStyle(screen.getByTestId('interactive-carousel-message-title'));
      expect(messageTitleStyles.backgroundColor).toBe('rgb(237, 237, 237)');
      const nestedPickerElementId = mockCarouselContent.elements[0].templateIdentifier;
      const nestedPickerStyles = window.getComputedStyle(screen.getByTestId(nestedPickerElementId));
      expect(nestedPickerStyles.backgroundColor).toBe('rgb(237, 237, 237)');
    });

    it("should apply default background styling for Carousel interactive message (when isLatestMessage = false)", () => {
      renderComponent({
        transportDetails: {
          status: "SendSuccess",
          direction: "Incoming",
          sentTime: 1654950925, // 6/11/2022
        },
        content: {
          data: JSON.stringify({  templateType: "Carousel", version: "1.0", data: { content: mockQuickReplyContent }}),
          type: ContentType.MESSAGE_CONTENT_TYPE.INTERACTIVE_MESSAGE,
        },
      }, { isLatestMessage: false });

      // Verify the background was removed for parent message body
      const messageBodyStyles = window.getComputedStyle(screen.getByTestId('message-body'));
      expect(messageBodyStyles.backgroundColor).toBe('rgb(237, 237, 237)');
    });

    it("should detect and properly render Carousel interactive message selection", () => {
      const timeStamp = 1654950925; // 6/11/2022
      renderComponent({
        transportDetails: {
          status: "SendSuccess",
          direction: "Outgoing",
          sentTime: timeStamp,
        },
        content: {
          data: "{\"listTitle\":\"Explore our travel options\",\"selectionText\":\"View All Destinations\",\"templateIdentifier\":\"list123\"}",
          type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN,
        },
      });

      const { getByText } = within(screen.getByTestId("main-message"));
      expect(getByText("Explore our travel options - View All Destinations")).toBeInTheDocument();
    });
  });
});
