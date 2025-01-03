import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthenticationMessage } from './AuthenticationMessage';
import { IntlProvider } from "react-intl";
import { ThemeProvider } from "../../../../theme";
import { ContentType } from "../../datamodel/Model";
import { getCurrentChatSessionInstance } from '../../ChatSession'; // Adjust the import path accordingly

window.open = jest.fn();
window.connect = jest.fn();
window.connect.ChatEvents = jest.fn();
window.connect.ChatEvents.onAuthenticationComplete = jest.fn();
jest.mock('../../ChatSession', () => ({
  getCurrentChatSessionInstance: jest.fn(),
}));
describe('AuthenticationMessage', () => {
  const link = 'https://www.example.com';
  const loginText = 'Please sign into your account';
  const failedText = 'Sign in failed';
  const cancelText = 'Continue without signing in';
  const successText = 'You are now signed in to your account';
  const cancelEventText = 'Sign in cancelled';
  
  const renderComponent = (customProps) => {
    render(
      <ThemeProvider>
        <IntlProvider locale="en">
          <AuthenticationMessage {...customProps} />
        </IntlProvider>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });
  it('calls cancelParticipantAuthentication when cancel link is clicked', () => {
    const mockCancelParticipantAuthentication = jest.fn();
    const mockChatSession = {
      cancelParticipantAuthentication: mockCancelParticipantAuthentication,
    };
    getCurrentChatSessionInstance.mockReturnValue(mockChatSession);
    const sessionId = 'testSessionId';

    renderComponent({
      link,
      content: { 
        type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED, 
        data: JSON.stringify({ SessionId: sessionId }) 
      }
    });

    const cancelLink = screen.getByText(cancelText);
    fireEvent.click(cancelLink);

    expect(mockCancelParticipantAuthentication).toHaveBeenCalledWith(sessionId);
  });
  it('renders the message correctly when AUTHENTICATION_INITIATED', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED }});
    expect(screen.getByText(loginText)).toBeInTheDocument();
    expect(screen.getByText(cancelText)).toBeInTheDocument();
  });

  it('opens a new window when the login button is clicked', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED }});
    const loginButton = screen.getByText(loginText);
    fireEvent.click(loginButton);
    expect(window.open).toHaveBeenCalledWith(link, '_blank', 'width=600,height=600');
  });

  it('disables the buttons after authentication is cancelled', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_CANCELLED }});
    const text = screen.getByText(cancelEventText);

    connect.ChatEvents.onAuthenticationComplete.mock.calls[0][0]();

    // Now buttons should be disabled
    expect(text).toBeDisabled();
  });

  it('disables the buttons after authentication is successful', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_SUCCESSFUL }});
    const text = screen.getByText(successText);
    connect.ChatEvents.onAuthenticationComplete.mock.calls[0][0]();
    expect(text).toBeDisabled();
  });

  it('disables the buttons after authentication is failed', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_FAILED }});
    const text = screen.getByText(failedText);
    connect.ChatEvents.onAuthenticationComplete.mock.calls[0][0]();
    expect(text).toBeDisabled();
  });

  it('renders the appropriate message for other event types', () => {
    renderComponent({ content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_TIMEOUT }});
    expect(screen.getByText('Sign in cancelled')).toBeInTheDocument();
  });

  it('does not open a new window when the button is disabled', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED } });
    const loginButton = screen.getByText(loginText);
    connect.ChatEvents.onAuthenticationComplete.mock.calls[0][0]();
    fireEvent.click(loginButton);

    // window.open should not be called again since the button is disabled
    expect(window.open).toHaveBeenCalledTimes(0);
  });

  it('changes the button color after being clicked (visited state)', () => {
    renderComponent({ link, content: {type: ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED }});
    const loginButton = screen.getByText(loginText);
    const cancelButton = screen.getByText(cancelText);

    // Simulate clicking the login button
    fireEvent.click(loginButton);
    expect(loginButton).toHaveStyle('color: #232F3E');

  });
});
