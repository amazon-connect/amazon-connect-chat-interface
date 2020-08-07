// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './';
import defaultImage from 'connect-images/ico-ccp-logo-default.svg';
import styled from "styled-components";

const Wrapper = styled.div`
 background: #EDEDEE;
  >button {
    margin: 20px;
  }
`
storiesOf('Button', module)
  .add('Available Buttons', () => (
    <Wrapper>
      <Button>Default</Button>
      <Button type="primary">
        Primary
      </Button>
      <Button type="secondary">
        Secondary
      </Button>
      <Button type="tertiary">
        Tertiary
      </Button>
      <Button icon={defaultImage} type="primary">
        With Icon
      </Button>
      <Button loading={true} type="primary">
        With Image
     </Button>
    </Wrapper>
  ));
