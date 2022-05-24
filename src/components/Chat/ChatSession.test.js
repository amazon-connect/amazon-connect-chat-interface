import ChatSession from './ChatSession';
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
                    sendAttachment: jest.fn().mockResolvedValue("ccc"),
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
