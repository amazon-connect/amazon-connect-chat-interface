// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const FlexLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
`;

const HeaderWrapper = styled(FlexLayout)`
  overflow: auto;
  background: ${props => props.theme.palette.darkGray};
  color: ${props => props.theme.palette.white};
`;

export default class Header extends Component {
  constructor(props) {
    super(props);
    console.log("Header called...", props);
  }
  render() {
    return (
      <HeaderWrapper>
        <div>
          <FormattedMessage id="agent.status" defaultMessage="CUSTOMER UI" />
        </div>
      </HeaderWrapper>
    );
  }
}
