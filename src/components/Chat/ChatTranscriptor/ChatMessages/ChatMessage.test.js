import React from 'react';
import "@testing-library/jest-dom";
import { render } from "@testing-library/react"
import { ParticipantMessage } from "./ChatMessage";
import { ThemeProvider } from "../../../../theme";
import { ContentType } from "../../datamodel/Model";
import { screen, within } from '@testing-library/dom';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

describe('ChatMessage', () => {
  beforeAll(() => {
    mockAllIsIntersecting(true);
    // set system date to 10/4/2022
    jest.useFakeTimers().setSystemTime(new Date(1664900925 * 1000));
  })

  afterAll(() => {
    jest.useRealTimers();
  })
  const basicProp = {
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
        sentTime: 1660865275
      },
      version: null,
    },
    textInputRef: React.createRef(),
    isLatestMessage: false,
    mediaOperations: {
      addMessage: jest.fn(),
      downloadAttachment: jest.fn()
    },
    sendReadReceipt: jest.fn(),
  }
  const renderComponent = (props) =>
    render(
        <ThemeProvider>
          <ParticipantMessage {...props} />
        </ThemeProvider>
    )

  it('should show short date format if message is sent in current day', () => {
    const timeStamp = 1664900925; // 10/4/2022
    const props = {
      ...basicProp,
      messageDetails: {
        ...basicProp.messageDetails,
        transportDetails: {
          status: "SendSuccess",
          direction: "Outgoing",
          sentTime: timeStamp
        },
        content: {
          data: "data",
          type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN
        },
      }
    }
    renderComponent(props);
    const { getByText } = within(screen.getByTestId('message-header'));
    expect(getByText('4:28 PM')).toBeInTheDocument();
  })

  it('should show long date format if message is not sent in current day', () => {
    const timeStamp = 1654950925; // 6/11/2022
    const props = {
      ...basicProp,
      messageDetails: {
        ...basicProp.messageDetails,
        transportDetails: {
          status: "SendSuccess",
          direction: "Outgoing",
          sentTime: timeStamp
        },
        content: {
          data: "data",
          type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN
        },
      }
    }
    renderComponent(props);
    const { getByText } = within(screen.getByTestId('message-header'));
    expect(getByText('Sat, Jun 11, 12:35 PM')).toBeInTheDocument();
  })

  it('should not render message if message content type is not valid', async () => {
    const props = {
      ...basicProp,
      messageDetails: {
        ...basicProp.messageDetails,
        content: {
          data: "data",
          type: 'application/json'
        },
      }
    }
    renderComponent(props);
    const message = await screen.queryByTestId('main-message');
    expect(message).toBeNull();
  })
})