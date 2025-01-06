import React from "react";
import { IntlProvider } from "react-intl";
import { SystemMessage } from "./SystemMessage";
import { ContentType } from "../../datamodel/Model";
import { PARTICIPANT_TYPES } from "../../datamodel/Model";
 
const TEST_DISPLAY_NAME = 'Test';
const GENERIC_DISPLAY_NAME = 'Generic Display Name';
window.connect = jest.fn();
window.connect.ChatEvents = jest.fn();
window.connect.ChatEvents.onAuthenticationComplete = jest.fn();
describe("SystemMessage", () => {
    let wrapper = null;
    const additionalProps = {
        // mock additional props
    };
 
    function createSystemMessage(messageDetails, props) {
        return shallow(
            <IntlProvider locale="en">
                <SystemMessage messageDetails={messageDetails} {...props} />
            </IntlProvider>
        );
    }
 
    afterEach(() => {
        wrapper = null;
    });
 
    it("should render joined event successfully", () => {
        const joinedEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_JOINED,
            },
            displayName: TEST_DISPLAY_NAME,
        }
        wrapper = createSystemMessage(joinedEvent);
        expect(wrapper.html()).toContain(`${TEST_DISPLAY_NAME} has joined the chat`);
    });

    it("should render auth initiated event successfully", () => {
        const joinedEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED,
            },
            displayName: TEST_DISPLAY_NAME,
            authenticationUrl: 'www.example.com'
        }
        wrapper = createSystemMessage(joinedEvent);
        expect(wrapper.html()).toContain(`Please sign into your account`);
    });

    it("should render auth cancelled event successfully", () => {
        const event = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_CANCELLED,
            },
            displayName: TEST_DISPLAY_NAME,
            authenticationUrl: 'www.example.com'
        }
        wrapper = createSystemMessage(event);
        expect(wrapper.html()).toContain(`Sign in cancelled`);
    });
 
    it("should render left event successfully", () => {
        const leftEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_LEFT,
            },
            displayName: TEST_DISPLAY_NAME,
        }
        wrapper = createSystemMessage(leftEvent);
        expect(wrapper.html()).toContain(`${TEST_DISPLAY_NAME} has left the chat`);
    });
 
    it("should render idle event successfully", () => {
        const leftEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_IDLE,
            },
            displayName: TEST_DISPLAY_NAME,
        }
        wrapper = createSystemMessage(leftEvent);
        expect(wrapper.html()).toContain(`${TEST_DISPLAY_NAME} has become idle`);
    });
 
    it("should render disconnect event successfully", () => {
        const leftEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_DISCONNECT,
            },
            displayName: TEST_DISPLAY_NAME,
        }
        wrapper = createSystemMessage(leftEvent);
        expect(wrapper.html()).toContain(`${TEST_DISPLAY_NAME} has been idle too long, disconnecting`);
    });
 
    it("should render returned event successfully", () => {
        const leftEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.PARTICIPANT_RETURNED,
            },
            displayName: TEST_DISPLAY_NAME,
        }
        wrapper = createSystemMessage(leftEvent);
        expect(wrapper.html()).toContain(`${TEST_DISPLAY_NAME} has returned`);
    });
 
    it("should render end event successfully", () => {
        const endEvent = {
            content: {
                type: ContentType.EVENT_CONTENT_TYPE.CHAT_ENDED,
            }
        }
        wrapper = createSystemMessage(endEvent);
        expect(wrapper.html()).toContain('Chat has ended!');
    });
 
    it("should render empty string if event type is unknown successfully", () => {
        const fakeEvent = {
            content: {
                type: 'mock event type',
            }
        }
        wrapper = createSystemMessage(fakeEvent);
        expect(wrapper.html()).toBe('');
    });
});