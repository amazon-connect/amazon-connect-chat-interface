// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { Component } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import defaultTheme from './defaultTheme';
import PT from 'prop-types';

export default class ThemeProvider extends Component {

  static propTypes = {
    children: PT.node.isRequired,
    theme: PT.objectOf(PT.object)
  }

  static defaultProps = {
    theme: defaultTheme
  }

  render() {
    const { theme, children } = this.props;
    return (
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    )
  }
}