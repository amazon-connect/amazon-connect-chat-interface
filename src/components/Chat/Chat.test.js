import React from 'react';
import Chat from './Chat';
import ThemeProvider from '../../theme/ThemeProvider';
import { render } from "@testing-library/react";
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const mockProps = {
    chatSession: {
        contactId: "2121",
        contactStatus: "connected",
        thisParticipant: {participantId: 'c8f96a', displayName: 'abc'},
        typingParticipants: [],
        on: jest.fn(),
        logger: {},
        off: jest.fn(),
        loadPreviousTranscript: jest.fn(),
        sendTypingEvent: jest.fn().mockReturnValue(Promise.resolve()),
    },
    composerConfig: {
        attachmentsEnabled: false,
    }
}

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
describe('<Chat />', () => {
    describe("when window.connect is defined", () => {
        let wrapper, instance;
        beforeAll(() => {
            window.connect = {
                LogManager: {
                    getLogger: function(obj) {
                        return {
                            debug: jest.fn(),
                            info: jest.fn(),
                            error: jest.fn()
                        }
                    }
                }
            }
            wrapper = shallow(<Chat {...mockProps} />);
            instance = wrapper.instance();
            navigator.__defineGetter__('userAgent', function(){
                return "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 )";
            });
        })

        afterAll(() => {
            delete window.connect;
        })

        test("Logger object should be initialized when component is created", () => {
            expect(instance.logger).not.toBeUndefined();
        })

        test("Info method should be called after componentDidMount method is called.", () => {
            instance.componentDidMount();
            expect(instance.logger.info).toBeCalled();
        })

        test("should reset the header height", () => {
            const mockResetHeightMethod = jest.spyOn(Chat.prototype, "resetChatHeight");
            render(<ThemeProvider>
                      <Chat {...mockProps} />
                    </ThemeProvider>);
            expect(screen.getByTestId('amazon-connect-chat-wrapper')).not.toBe(null);
            expect(mockResetHeightMethod).toBeCalled();
        })

        test("Should be able to jitter to fix iphone mobile scroll issue", () => {
            const mockResetHeightMethod = jest.spyOn(Chat.prototype, "resetChatHeight");
            const mockComposer = render(
                <ThemeProvider>
                    <Chat {...mockProps} />
                </ThemeProvider>
            );
            expect(screen.getByTestId('amazon-connect-chat-wrapper')).not.toBe(null);
            expect(mockResetHeightMethod).toBeCalled();
      
            const testMessage = 'Hello, World!';
            const textInput = mockComposer.getByTestId('customer-chat-text-input');
            userEvent.type(textInput, testMessage);
            expect(document.querySelector('[data-testid="amazon-connect-chat-wrapper"] div input')).not.toBe(null);
        })
    })

    describe("when window.connect is not defined", () => {
        const wrapper = shallow(<Chat {...mockProps} />);
        const instance = wrapper.instance();
        test("Logger object should not be initialized", () => {
            expect(instance.logger).toBeUndefined();
        })
    })

});
