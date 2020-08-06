import React from 'react';
import ReactDOM from 'react-dom';
import ChatActionBar from './ChatActionBar';
import { ThemeProvider } from '../../../theme';

describe('<ChatActionBar />', () => {
  test("Style should match the snapshot", () => {
    const addMessageFn = jest.fn();
    const tree = createTree(<ThemeProvider><ChatActionBar contactStatus="connected"/></ThemeProvider>);
    expect(tree).toMatchSnapshot();
  });
});

