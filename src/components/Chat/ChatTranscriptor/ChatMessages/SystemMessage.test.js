import React from "react";
import { SystemMessage } from "./SystemMessage";
import { ContentType } from "../../datamodel/Model";
import { PARTICIPANT_TYPES } from "../../datamodel/Model";
 
const TEST_DISPLAY_NAME = 'Test';
const GENERIC_DISPLAY_NAME = 'Generic Display Name';
 
describe("SystemMessage", () => {
    let wrapper = null;
    const additionalProps = {
        // mock additional props
    };
 
    function createSystemMessage(messageDetails, props) {
        return shallow(
                <SystemMessage messageDetails={messageDetails} {...props} />

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