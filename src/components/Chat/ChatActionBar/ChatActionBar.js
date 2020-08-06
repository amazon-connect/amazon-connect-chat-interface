// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import PT from "prop-types";
import { Button } from "connect-core";
import { CONTACT_STATUS } from "connect-constants";

const Actions = styled.div`
  background: ${props => props.theme.palette.dustyGray};
  height: 85px;
`;

const FooterWrapper =  styled.div`
  order: 4;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 100%;
  align-items: center;
  > button {
    min-width: 85px;
    margin: ${props => props.theme.spacing.mini};
    font-weight: bold;
  }
`;

const ActionButton = styled(Button)`
  margin: ${props => props.theme.spacing.small};
  width: ${props => (props.col ? 100 / props.col - 7 + "%" : "")};
  
`;

function createMarkup(content) {
  return {__html: content};
}

export default class ChatActionBar extends React.Component {

  static propTypes = {
    contactStatus: PT.string.isRequired,
    onEndChat: PT.func,
    onClose: PT.func,
    footerConfig: PT.object
  };

  static defaultProps = {
    onEndChat: () => {},
    onClose: () => {},
    footerConfig: {}
  };
  
  render() {
    const {
      contactStatus,
      onEndChat,
      onClose,
      footerConfig
    } = this.props;

    if(footerConfig.render){
      const content = footerConfig.render(this.props);
      return footerConfig.isHTML ? <FooterWrapper dangerouslySetInnerHTML={createMarkup(content)} />
      : <FooterWrapper>{content}</FooterWrapper>
    }

    return (
      <FooterWrapper>
        <Actions>
          <ButtonWrapper>
            {(contactStatus === CONTACT_STATUS.CONNECTED ||
              contactStatus === CONTACT_STATUS.CONNECTING) && (
              <React.Fragment>
                <ActionButton
                  col="2"
                  type="default"
                  onClick={onEndChat}
                >
                  <FormattedMessage
                    id="Chat.EndChat"
                    defaultMessage="End chat"
                  />
                </ActionButton>
              </React.Fragment>
            )}

           {contactStatus === CONTACT_STATUS.ENDED && 
            <React.Fragment>
                <ActionButton
                  col="2"
                  type="default"
                  onClick={onClose}
                >
                  <FormattedMessage
                    id="Chat.Close"
                    defaultMessage="Close"
                  />
                </ActionButton>
              </React.Fragment>
           
           }
          </ButtonWrapper>
        </Actions>
      </FooterWrapper>
    );
  }
}
