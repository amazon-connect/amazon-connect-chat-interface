# Amazon Connect Chat Interface
## Overview
Amazon Connect Chat Interface is a light interface for getting started with Amazon Connect chat. This package contains
some lightweight components to render chat out of the box in your website, with a thin layer on top of [ChatJS](https://github.com/amazon-connect/amazon-connect-chatjs)
to manage your chat session.

Usage of this package in your website is described at https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI#prebuilt-chat-widget.

## Building the package

Importing this file into your project will place a `ChatInterface` object on the window, which contains a method to `initiateChat`.
To init chat, you will pass in some details about your Connect instance, the requesting user, and the API Gateway generated 
via the (getting started process)[https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI#prebuilt-chat-widget].

### Local
To make local modifications to this package and test them on your webpage, simply make your edits and run `npm run dev-build` to produce the
Webpack built file and the sourcemaps (in `dist/`). You can import these in the same fashion as the getting started examples.

### Production
To build the production version of this package, run `npm run build`. These will generate a minified built file in `build/`, with console logs stripped and other Webpack optimizations.
Import this into your package as is described in the GitHub examples.

## Customization
### Theme
When invoking `ChatInterface.init`, we have the option to pass in a `themeConfig` object as part of the props. This should resemble the same object as the theme config in `src/theme/defaultTheme.js`. This allows modification of colors, fonts, spacing, button styles, and more.
