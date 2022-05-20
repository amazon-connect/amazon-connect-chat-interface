// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config } from "./utils/log";

import defaultTheme from './theme/defaultTheme';

(function (connect) {
  connect.LogManager && connect.LogManager.updateLoggerConfig(config);
  connect.ChatInterface = connect.ChatInterface || {};
  connect.ChatInterface.init = ({containerId, ...props}) => {
    connect.ChatSession.setGlobalConfig(config);
    ReactDOM.render(
      <BrowserRouter><App {...props}/></BrowserRouter>, document.getElementById(containerId) || document.getElementById("root"));
  };

  connect.ChatInterface.getCurrentTheme = () => {
    return defaultTheme;
  };



  window.connect = connect;
}(window.connect || {}));


