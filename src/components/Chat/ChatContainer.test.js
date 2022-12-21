import React from 'react';
import ChatContainer from './ChatContainer';
import { render, waitFor } from '@testing-library/react';
import ThemeProvider from '../../theme/ThemeProvider';
import request from '../../utils/fetchRequest';
import EventBus from "./eventbus";
import { START_CHAT_REQUEST, CSM_CATEGORY } from '../../constants/global';

jest.mock('../../utils/fetchRequest');

const startChatResponse = {
  json: {
    data: {
      persistedChatSession: "aaa",
      featurePermissions: { ATTACHMENTS: false },
      startChatResult: {
        ContactId: "abc",
        ParticipantId: "cde",
        ParticipantToken: "efg",
      }
    },
  }
}

const clientConfig = {
  contactFlowId: "",
  instanceId: "",
  region: "",
  stage: "prod",
  contactAttributes: {},
  featurePermissions: {},
};

const config = {
  themeConfig: {
    chatTranscriptor: {
      background: "rgba(242, 242, 242, 0.49)",
      outgoingMsgBg: "#AADFB4",
      incomingMsgBg: "#EDEDED",
      outgoingMsg: {
        background: "#AADFB4"
      },
      incomingMsg: {
        background: "#EDEDED"
      }
    },
    fonts: {
      override: "Comic Sans MS"
    },
    header: {
      background: "#319"
    }
  },
  headerConfig: {
    headerText: "Hello"
  },
}

describe("<ChatContainer />", () => {
  beforeAll(() => {
    window.connect = {
      LogManager: {
        getLogger: function (obj) {
          return {
            debug: jest.fn(),
            info: jest.fn(),
            error: jest.fn()
          }
        }
      },
      ChatSession: {
        create: function (obj) {
          return {
            controller: { contactId: "aaa" },
            getChatDetails: jest.fn(() => {
              return { participantId: "123" }
            }),
            onMessage: jest.fn().mockResolvedValue("aaa"),
            onTyping: jest.fn().mockResolvedValue("aaa"),
            onReadReceipt: jest.fn().mockResolvedValue("aaa"),
            onDeliveredReceipt: jest.fn().mockResolvedValue("aaa"),
            onEnded: jest.fn().mockResolvedValue("aaa"),
            onConnectionEstablished: jest.fn().mockResolvedValue("aaa"),
            connect: jest.fn().mockResolvedValue("aaa"),
            sendMessage: jest.fn().mockResolvedValue("aaa"),
            sendEvent: jest.fn().mockResolvedValue("bb"),
            sendAttachment: jest.fn().mockImplementation((...input) =>
              new Promise((resolve, reject) => {
                if (input[0].attachment.status === "resolve") {
                  resolve(input[0].attachment);
                } else {
                  reject(input[0].attachment);
                }
              })
            ),
          }
        },
      },
    }
  })

  afterAll(() => {
    delete window.connect;
  })

  const renderComponent = () =>
    render(
        <ThemeProvider>
            <ChatContainer {...config} />
        </ThemeProvider>
    );

  it("should render component successfully", async () => {
    request.mockResolvedValue(startChatResponse);
    renderComponent();
    const success = jest.fn();
    const failure = jest.fn();
    EventBus.trigger("initChat", clientConfig, success, failure);
    await waitFor(() => {
      expect(success).toBeCalled();
    })
  });

  it('should fail to render component', async () => {
    request.mockRejectedValue(new Error('error'));
    renderComponent();
    const success = jest.fn();
    const failure = jest.fn();
    EventBus.trigger("initChat", clientConfig, success, failure);
    await waitFor(() => {
      expect(failure).toBeCalled();
    })
  })
})


