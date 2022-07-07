import ChatSession from './ChatSession';
import { AttachmentErrorType } from "./datamodel/Model";

const chatDetails = {
    startChatResult: {
        "ContactId": "aaa",
        "ParticipantId": "ccc",
        "ParticipantToken": "bbb"
    }}
const region = "us-west-2";
const stage = "dev";

beforeAll(() => {
    window.connect = {
        ChatSession: {
            create: function(obj) {
                return {
                    controller: {contactId: "aaa"},
                    getChatDetails: jest.fn(() => {
                        return {participantId: "123"}
                    }),
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
        }
    }
})
afterAll(() => {
    delete window.connect;
});

describe("ChatSession", () => {
    describe("About logger", () => {
        describe("LogManager is defined", () => {
            let session;
            beforeEach(() => {
                window.connect.LogManager = {
                    getLogger: function(obj) {
                        return {
                            debug: jest.fn(),
                            info: jest.fn(),
                            error: jest.fn()
                        }
                    }
                }
                session = new ChatSession(chatDetails, region, stage);
            })
            test("logger should be defined when LogManager is available", () => {
                expect(session.logger).toBeDefined();
            })

            test("logger should be called when addOutgoingMessage is triggered", () => {
                session.addOutgoingMessage({});
                expect(session.logger.info).toBeCalled()
            })
            test("logger should be called when sendTypingEvent is triggered", () => {
                session.sendTypingEvent();
                expect(session.logger.info).toBeCalled()
            })
            test("logger should be called when addOutgoingAttachment is triggered", () => {
                session.addOutgoingAttachment({});
                expect(session.logger.info).toBeCalled()
            })
            test("logger should be called when 'on' is triggered", () => {
                session.on("incoming-message", jest.fn(() => {}));
                expect(session.logger.info).toBeCalled()
            })
            test("logger should be called when 'off' is triggered", () => {
                session.off("incoming-message", jest.fn(() => {}));
                expect(session.logger.info).toBeCalled()
            })
            test("logger should be called when closeChat is triggered", () => {
                session.closeChat();
                expect(session.logger.info).toBeCalled()
            })

            test("sendAttachment: should display correct message if ServiceQuotaExceeded", () => {
                const DEFAULT_MESSAGE = "DEFAULT_MESSAGE";
                Object.values(AttachmentErrorType).forEach(exceptionType => {
                  let transcriptItem = {
                    content: {
                      status: "error",
                      type: exceptionType,
                      message: DEFAULT_MESSAGE
                    },
                    transportDetails: {},
                    id: ""
                  };
                  const returnVal = session.sendAttachment(transcriptItem);
                  returnVal.then(() => {
                    if (transcriptItem.transportDetails.error.type === AttachmentErrorType.ServiceQuotaExceededException) {
                      expect(transcriptItem.transportDetails.error.message).toEqual("Attachment failed to send. The maximum number of attachments allowed, has been reached");
                    } else if (transcriptItem.transportDetails.error.type === AttachmentErrorType.ValidationException) {
                      expect(transcriptItem.transportDetails.error.message).toEqual(DEFAULT_MESSAGE);
                    } else {
                      expect(transcriptItem.transportDetails.error.message).toEqual("Attachment failed to send");
                    }
                  }).catch(e => {
                    console.log("REJECTED", e);
                  })
                });
              })
        })

        describe("LogManager is undefined", () => {
            test("logger should be undefined when LogManager is not available", () => {
                delete window.connect.LogManager;
                const session = new ChatSession(chatDetails, region, stage);
                expect(session.logger).toBeUndefined();
            })
        })

    })
})
