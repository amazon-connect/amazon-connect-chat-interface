// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React from 'react';
import { IntlProvider } from 'react-intl';
import ChatActionBar from './ChatActionBar';
import { ThemeProvider } from '../../../theme';

describe('<ChatActionBar />', () => {
  test("Style should match the snapshot", () => {
    const addMessageFn = jest.fn();
    const tree = createTree(<ThemeProvider>
      <IntlProvider
          locale="en"
          onError={jest.fn}
          key="en"
          messages={{}}>
        <ChatActionBar contactStatus="connected"/>
      </IntlProvider>
    </ThemeProvider>);
    expect(tree).toMatchSnapshot();
  });
  let wrapper, instance;
  describe("When connect object is defined", () => {
    beforeAll(() => {
      window.connect = {
        LogManager: {
          getLogger: function(obj) {
            return {
              debug: jest.fn(),
              info: jest.fn(),
              error: jest.fn()
            }
          }
        }
      }
      wrapper = shallow(<ChatActionBar contactStatus="connected" />);
      instance = wrapper.instance();
    })

    afterAll(() => {
      delete window.connect;
    })

    test("Logger object should be initialized when component is created", () => {
      expect(instance.logger).not.toBeUndefined();
    })

    test("Info method should be called after component is mounted.", () => {
      instance.componentDidMount();
      expect(instance.logger.info).toBeCalled();
    })
  })

  describe("When connect object is not defined", () => {
    let wrapper = shallow(<ChatActionBar contactStatus="connected" />);
    let instance = wrapper.instance();
    test("logger should be undefined", () => {
      window.connect = undefined;
      expect(instance.logger).toBeUndefined();
    })
  })

});

