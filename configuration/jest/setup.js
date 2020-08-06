import renderer from 'react-test-renderer';
import React from 'react';
import "jest-styled-components"
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../src/theme';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

function createNodeMock(element) {
  return {
    scrollTo: jest.fn()
  }
}

const createTree = (Component, themeOverride) => {
  const theme = themeOverride || defaultTheme;
  const ComponentWithTheme = React.cloneElement(
    Component,
    { theme },
  );
  return renderer.create(ComponentWithTheme, {createNodeMock}).toJSON();
};

global.createTree = createTree;
global.shallow = shallow;