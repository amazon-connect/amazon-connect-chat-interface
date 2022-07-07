import React from 'react';
import styled from 'styled-components';
import defaultTheme from '../../../theme/defaultTheme';
import { KEYBOARD_KEY_CONSTANTS } from "connect-constants";

const ACTIVE_COLOR = defaultTheme.palette.secondaryBlack;
const INACTIVE_COLOR = defaultTheme.palette.whisper;

const SendButton = styled.div`
  cursor: ${props => props.isActive ? 'pointer' : 'default'};

  &>svg {
    fill: ${props => props.isActive ? ACTIVE_COLOR : INACTIVE_COLOR};
  }
`;

/**
 * Send message button for the Chat Composer.
 * 
 * @param {Object} props
 * @param {boolean} props.isActive
 * @param {Function} props.sendMessage
 */
function SendMessageButton({ isActive, sendMessage }) {
  return (
    <SendButton 
      isActive={isActive}
      onClick={sendMessage}
      data-testid="customer-chat-send-message-button"
      aria-label="Send Message"
      tabIndex={0}
      onKeyDown={(e) => {
        // if space or enter is pressed
        if (e.key === KEYBOARD_KEY_CONSTANTS.SPACE || e.key === KEYBOARD_KEY_CONSTANTS.ENTER) {
          sendMessage(e);
        }
      }}
      >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
    </SendButton>
  );
};

export default SendMessageButton;