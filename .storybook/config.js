import { configure, addDecorator } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from "../src/theme/"
import Fonts from "../src/assets/fonts";
import styled from "styled-components"
import {withInfo} from '@storybook/addon-info'

const Wrapper = styled.div`
  margin: 20px;
`
const ThemeDecorator = (storyFn) => (
  <ThemeProvider>
    <Wrapper>
      <Fonts />
      {storyFn()}
    </Wrapper>
  </ThemeProvider>
);
addDecorator(withInfo);
addDecorator(ThemeDecorator);
const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
