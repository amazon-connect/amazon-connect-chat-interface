import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { AUTHENTICATION_POPUP_HEIGHT, AUTHENTICATION_POPUP_WIDTH } from '../../../Chat/constants';
import { ContentType } from "../../datamodel/Model";
import { getCurrentChatSessionInstance } from '../../ChatSession';

const AuthenticationEventText = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.disabled ? '#879596' : props.visited ? '#232F3E' : '#0972D3')};
  text-align: center;
  font-family: "Amazon Ember";
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  text-decoration: ${(props) => (props.disabled ? 'none' : 'underline')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  &:focus {
    outline: none;
  }
`;

const messages = {
    [ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_EXPIRED]: {
        id: 'transcriptor.authenticationExpired',
        defaultMessage: 'Sign in expired',
    },
    [ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_FAILED]: {
        id: 'transcriptor.authenticationFailed',
        defaultMessage: 'Sign in failed',
    },
    [ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_TIMEOUT]: {
        id: 'transcriptor.authenticationTimeout',
        defaultMessage: 'Sign in cancelled',
    },
    [ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_CANCELLED]: {
        id: 'transcriptor.authenticationTimeout',
        defaultMessage: 'Sign in cancelled',
    },
    [ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_SUCCESSFUL]: {
        id: 'transcriptor.authenticationSuccessful',
        defaultMessage: 'You are now signed in to your account'
    },
    [ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED]: {
        id: 'transcriptor.authenticationInitiated',
        defaultMessage: 'Please sign into your account',
    },
};

const AuthenticationMessage = ({ link, content }) => {
    const [linksDisabled, setLinksDisabled] = useState(false);
    const [authLinkVisited, setAuthLinkVisited] = useState(false);
    const [cancelLinkVisited, setCancelLinkVisited] = useState(false);
    const eventType = content.type;
    let sessionId;
    try {
        sessionId = JSON.parse(content.data).SessionId;
    } catch (error) {
        console.error("Invalid JSON content", error);
    }

    connect.ChatEvents.onAuthenticationComplete((callback) => {
        setLinksDisabled(true);
    });

    const openLink = (event) => {
        event.preventDefault();
        if (!linksDisabled) {
            setAuthLinkVisited(true);
            window.open(link, '_blank', `width=${AUTHENTICATION_POPUP_WIDTH},height=${AUTHENTICATION_POPUP_HEIGHT}`);
        }
    };

    const cancelSignIn = (event) => {
        event.preventDefault();
        setCancelLinkVisited(true);
        var chatSession = getCurrentChatSessionInstance();
        chatSession.cancelParticipantAuthentication(sessionId);
    };

    const { id, defaultMessage } = messages[eventType] || {};

    return (
        <>
            {eventType === ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED && (
                <>
                    {link ? (
                        <AuthenticationEventText onClick={openLink} disabled={linksDisabled} visited={authLinkVisited}>
                            <FormattedMessage id={id} defaultMessage={defaultMessage} />
                        </AuthenticationEventText>
                    ) : (
                        <AuthenticationEventText disabled={true}>
                            <FormattedMessage id="transcriptor.authenticationUnavailable" defaultMessage="Sign in unavailable" />
                        </AuthenticationEventText>
                    )}
                    <br />
                    <AuthenticationEventText onClick={cancelSignIn} disabled={linksDisabled || !sessionId} visited={cancelLinkVisited}>
                        <FormattedMessage id="transcriptor.cancelSignIn" defaultMessage={"Continue without signing in"} />
                    </AuthenticationEventText>
                </>
            )}
            {eventType !== ContentType.EVENT_CONTENT_TYPE.AUTHENTICATION_INITIATED && (
                <AuthenticationEventText disabled={true}>
                    <FormattedMessage id={id} defaultMessage={defaultMessage} />
                </AuthenticationEventText>
            )}
        </>
    );
};

export { AuthenticationMessage };
