import React from 'react';
import Chat from './Chat';
import ThemeProvider from '../../theme/ThemeProvider';
import { render } from "@testing-library/react";
import {screen} from '@testing-library/dom';

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
    },
    composerConfig: {
        attachmentsEnabled: false,
    }
}

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
    })

    describe("when window.connect is not defined", () => {
        const wrapper = shallow(<Chat {...mockProps} />);
        const instance = wrapper.instance();
        test("Logger object should not be initialized", () => {
            expect(instance.logger).toBeUndefined();
        })
    })

});
