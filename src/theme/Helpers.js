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

export {
  FlexColumnContainer,
  FlexRowContainer
}