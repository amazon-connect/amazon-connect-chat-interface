// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import styled from 'styled-components';

const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.center ? "center": "space-between"};
  align-items: ${props => props.center ? "center": "normal"}; 
`

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.center ? "center": "space-between"};
  align-items: ${props => props.center ? "center": "normal"}; 
`

const FlexVerticalCenterContainer = styled.div `
  display: flex;
  align-items: center;
`;
 
const FlexColumnSpaceBetweenContainer = styled.div `
  display:flex;
  align-items: center;
  justify-content: space-between;
`;
 
const Mask = styled.div `
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  outline: none;
  background-color: ${props => props.theme.palette.white};
  z-index: ${props => props.theme.zIndex.level_2};
`;
 
const HiddenText = styled.span `
  position: absolute;
  pointer-events: none;
  color: transparent;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
`;
 
const HiddenLevelOneHeading = styled.h1 `
  width: 0;
  height: 0;
  pointer-events: none;
  color: transparent;
  overflow: hidden;
`;

export {
  FlexColumnContainer,
  FlexRowContainer,
  FlexVerticalCenterContainer,
  FlexColumnSpaceBetweenContainer,
  Mask,
  HiddenText,
  HiddenLevelOneHeading
}