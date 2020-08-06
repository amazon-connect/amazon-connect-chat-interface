import React from 'react';
import ReactDOM from 'react-dom';
import ChatComposer from './ChatComposer';
import { ThemeProvider } from '../../../theme';

// Dummy messages
const messages = [
  {
    id: 1,
    message: "Welcome bro",
    from: "agent"
  }, {
    id: 2,
    message: "Hello bro",
    from: "customer"
  },
  {
    id: 3,
    message: "Visit this for more info https://reactjs.org/docs/dom-elements.html",
    from: "agent"
  }
]

describe('<ChatComposer />', () => {
  test("Style should match the snapshot", () => {
    const tree = createTree(<ThemeProvider><ChatComposer messages={messages} /></ThemeProvider>);
    expect(tree).toMatchSnapshot();
  });
});
