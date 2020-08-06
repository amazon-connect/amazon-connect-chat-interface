import React from 'react';
import { storiesOf } from '@storybook/react';
import Text from './';

storiesOf('Text', module)
  .add('All text variations', () => (
    <React.Fragment>
      <Text type="h1">H1</Text>
      <Text type="h2">H2</Text>
      <Text type="h3">H3</Text>
      <Text type="h4">H4</Text>
      <Text type="h5">H5</Text>
      <Text type="h6">H6</Text>
      <Text type="p">P</Text>
      <Text type="h1" styleAs="h2">H1 tag that looks like H2</Text> <Text inline>I am inline</Text>
    </React.Fragment>
  ));