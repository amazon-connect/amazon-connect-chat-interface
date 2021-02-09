// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { PureComponent } from 'react';
import PT from 'prop-types';
import styled from 'styled-components';
import { Icon, Loader} from 'connect-core';

const globalStyles = ({ button, globals, fonts }) => (`
  white-space: nowrap;
  color: ${button.color};
  cursor: ${button.cursor};
  text-align: center;
  vertical-align: middle;
  border-width: 0px;
  border-style: solid;
  padding-right: 10px;
  padding-left: 10px;
  font-family: ${fonts.medium};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 260px;
`);

const normalStyles = ({ button }) => (`
  padding-top: ${button.normal.padding};
  padding-bottom: ${button.normal.padding};
  font-size: ${button.normal.fontSize};
  box-shadow:  ${button.normal.boxShadow};
`);

const smallStyles = ({ button }) => (`
  padding-top: ${button.small.padding};
  padding-bottom: ${button.small.padding};
  font-size: ${button.small.fontSize};
`);

const defaultStyles = ({ button, globals, spacing }) => (`
  background: ${button.default.bg};
  border-color: ${button.default.borderColor};
  
  &:hover {
    background: ${button.default.bgHover};
  }

  &:focus {
    box-shadow: ${globals.boxShadowFocus};
    outline: none;
  }

  &:active{
    border-color: ${button.default.borderColorActive};
  }

  &:disabled {
    ${globals.disabled}
    pointer-events: none;

    &:hover {
      background: ${button.default.bg};
    }
  }
  > img,.loader{
    margin-right: ${spacing.regular};
    position: relative;
    top: 1px;
  }
`);


const applyButtonStyles = ({ button, globals }, type) => (`
  background: ${button[type].bg};
  border-color: ${button[type].borderColor};

  color: ${button[type].color};

  &:hover {
    background: ${button[type].bgHover};
  }

  &:focus {
    box-shadow: ${globals.boxShadowFocus};
    outline: none;
  }

  &:active{
    border-color: ${button[type].borderColorActive};
  }

  &:disabled {
    ${globals.disabled}
    pointer-events: none;

    &:hover {
      background: ${button[type].bg};
    }
  }
`);

export const StyledButton = styled.button`
  ${({ theme }) => theme.typography.base};
  ${({ theme }) => globalStyles(theme)};
  ${({ theme }) => defaultStyles(theme)};
  ${props => props.type && applyButtonStyles(props.theme, props.type)};
  ${props => props.small ? smallStyles(props.theme) : normalStyles(props.theme)};
`;
StyledButton.displayName = 'StyledButton';

const StyledLink = styled.a`
  ${({ theme }) => theme.typography.base};
  ${props => props.type && applyButtonStyles(props.theme, props.type)};
  ${props => props.small ? smallStyles(props.theme) : normalStyles(props.theme)};
  display: inline-block;
  line-height: normal;
  &:visited,
  &:active,
  &:link {
    text-decoration: none;
    ${({ theme }) => globalStyles(theme)};
  }
`;
StyledLink.displayName = 'StyledLink';

export default class Button extends PureComponent {
  static propTypes = {
    type: PT.oneOf(['default', 'primary', 'secondary','secondary_alt', 'tertiary', 'standard']),
    small: PT.bool,
    disabled: PT.bool,
    href: PT.string,
    iconSize: PT.oneOf(['small', 'medium', "mini"]),
    selected: PT.bool
  }

  static defaultProps = {
    type: 'default',
    small: false,
    disabled: false,
    href: undefined,
    loaderColor: '#fff',
    iconSize: "small",
    selected: false
  }

  render() {
    const {
      href,
    } = this.props;

    if (href) {
      return (
        <StyledLink {...this.props} type={undefined} />
      );
    }
    return (
      <StyledButton {...this.props} data-selected={this.props.selected} disabled={this.props.loading || this.props.disabled}>
        {this.props.loading && <Loader color={this.props.loaderColor}/>}
        {this.props.icon && !this.props.loading && <Icon src={this.props.icon} type={this.props.iconSize}/>}
        {this.props.children}
      </StyledButton>
    );
  }
}