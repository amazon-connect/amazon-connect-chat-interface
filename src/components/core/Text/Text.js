// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from 'react';
import PT from 'prop-types';
import styled from 'styled-components';

const StyledH1 = styled.h1`
  ${({ styleAs, theme }) => (theme.typography[styleAs || 'h1'])}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
  ${({ inline }) => inline && 'display:inline;'}
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.h1Margin : 0)};
`;

const StyledH2 = styled.h2`
  ${({ styleAs, theme }) => (theme.typography[styleAs || 'h2'])}
  ${({ inline }) => inline && 'display:inline;'}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.h2Margin : 0)};
`;
const StyledH3 = styled.h3`
  ${({ styleAs, theme }) => (theme.typography[styleAs || 'h3'])}
  ${({ inline }) => inline && 'display:inline;'}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.h3Margin : 0)};
`;
const StyledH4 = styled.h4`
  ${({ styleAs, theme }) => (theme.typography[styleAs || 'h4'])}
  ${({ inline }) => inline && 'display:inline;'}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.h4Margin : 0)};
`;
const StyledH5 = styled.h5`
  ${({ styleAs, theme }) => (theme.typography[styleAs || 'h5'])}
  ${({ inline }) => inline && 'display:inline;'}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.h5Margin : 0)};
`;
const StyledH6 = styled.h6`
  ${({ styleAs, theme }) => (theme.typography[styleAs || 'h6'])}
  ${({ inline }) => inline && 'display:inline;'}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.h6Margin : 0)};
`;

const StyledP = styled.p`
  ${({ theme }) => theme.typography.base}
  ${({ inline }) => inline && 'display:inline;'}
  color: ${({ theme, textColor }) => (theme.typography.color[textColor] || 'inherit')};
 
  margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.baseMargin : 0)};
 
  &:last-child {
    margin: ${({ theme: { typography }, withMargin }) => (withMargin ? typography.baseMargin : 0)};
  }
`;
export default class Text extends PureComponent {
  static propTypes = {
    type: PT.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']),
    withMargin: PT.bool,
    styleAs: PT.string,
    inline: PT.bool,
    textColor: PT.oneOf(['base', 'secondary', 'tertiary']),
  }

  static defaultProps = {
    type: 'p',
    withMargin: false,
    styleAs: undefined,
    inline: false,
    textColor: null,
  }

  render() {
    const {
      type,
      ...rest
    } = this.props;

    switch (type) {
      case 'h1': return <StyledH1 {...rest} />;
      case 'h2': return <StyledH2 {...rest} />;
      case 'h3': return <StyledH3 {...rest} />;
      case 'h4': return <StyledH4 {...rest} />;
      case 'h5': return <StyledH5 {...rest} />;
      case 'h6': return <StyledH6 {...rest} />;
      case 'p': return <StyledP {...rest} />;
      default: return <StyledP {...rest} />;
    }
  }
}