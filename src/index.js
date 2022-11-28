// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import globalConfig from "./config";

import defaultTheme from './theme/defaultTheme';

(function (connect) {
  connect.LogManager && connect.LogManager.updateLoggerConfig(globalConfig);
  connect.ChatInterface = connect.ChatInterface || {};

  connect.ChatInterface.init = ({containerId, ...props}) => {
    if (props.widgetType) {
      // Save CSM config if enabled
      globalConfig.csmConfig = { widgetType: props.widgetType }
    }
    
    connect.ChatSession.setGlobalConfig(globalConfig);
    
    ReactDOM.render(
      <BrowserRouter><App {...props}/></BrowserRouter>,
      document.getElementById(containerId) || document.getElementById("root")
    );
  };

  connect.ChatInterface.getCurrentTheme = () => {
    return defaultTheme;
  };

  window.connect = connect;
}(window.connect || {}));


