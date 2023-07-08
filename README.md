# Amazon Connect Chat Interface

## Table of content

  - [Overview](#overview)
  - [Building the package](#building-the-package)
    - [Local](#local)
    - [Production](#production)
  - [Customization](#customization)
    - [Logger Configuration](#logger-configuration)
    - [Theme](#theme)
    - [Message Receipts](#message-receipts)
    - [Rich Text Formatting](#rich-text-formatting)
    - [Custom Chat Duration](#custom-chat-duration)
    - [Audio Notifications](#audio-notifications)
  - [Components](#components)
    - [Chat.js (src/components/Chat)](#chatjs-srccomponentschat)
    - [Chat Transcriptor (src/components/Chat/ChatTranscriptor)](#chat-transcriptor-srccomponentschatchattranscriptor)
    - [Chat Action Bar](#chat-action-bar)
    - [Chat Composer](#chat-composer)
  - [Interactive message](#interactive-message)
    - [Implement action buttons in interactive message](#implement-action-buttons-in-interactive-message)

## Overview
Amazon Connect Chat Interface is a light interface to create a customer widget for getting started with Amazon Connect chat. This package contains
some lightweight components to render chat out of the box in your website, with a thin layer on top of [ChatJS](https://github.com/amazon-connect/amazon-connect-chatjs)
to manage your chat session.

An example of how you can add this package to an html page is described in the [local-testing](local-testing/) folder. You can see other examples in this [GitHub repo](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI) as well.

## Building the package

Importing this file into your project will place a `ChatInterface` object on the window, which contains a method to `initiateChat`.
To initiate the chat, you will pass in some details about your Connect instance, the requesting user, and the API Gateway generated 
via the [getting started process](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI#prebuilt-chat-widget).

### Local
To make local modifications to this package and test them on your webpage, simply make your edits and run `npm install && npm run dev-build` to produce the
Webpack built file and the sourcemaps. You can import these in the same fashion as the getting started examples.

### Production
To build the production version of this package, simply run `npm install && npm run build`. These will generate a minified built file, with console logs stripped and other Webpack optimizations.
Import this into your package as is described in the GitHub examples.

## Customization
### Logger Configuration
The logger is provided by [amazon-connect-chatjs](https://github.com/amazon-connect/amazon-connect-chatjs) package, you can configure it in this file: `src/utils/log.js`.
- By default, the logger is activated in this package with `INFO` level. If you want to deactivate it, you can set `config.loggerConfig.useDefaultLogger` to `false`.
- There are three log levels available - DEBUG, INFO, ERROR.
- If you want to use your own logger, you can add them into `customizedLogger` , and add `customizedLogger` object as the value of `globalConfig.loggerConfig.customizedLogger`, then set the lowest logger level. `globalConfig.loggerConfig.useDefaultLogger` is not required.
- If you want to use the default logger provided by Chat-js, you can set the logger level, and set `useDefaultLogger` to true. `globalConfig.loggerConfig.customizedLogger` is not required.
- If you not only provide your own logger, but also set `useDefaultLogger` to true, your own logger will be overwritten by the default logger.
- How we define log level?
  1. DEBUG: Print meta data, we can use it to print api response data;
  2. INFO: Print the information regarding the current state, or the most recent user event.
  3. ERROR: Print the error messages caused by UI issue, API issue or network issue.
  
```
// Add your own logger function here
var customizedLogger = {
  debug: (data) => {// customize logger function here},
  info: (data) => {// customize logger function here},
  error: (data) => {// customize logger function here}
}
  
var globalConfig = {
  loggerConfig: {
    // You can provide your own logger here, otherwise 
    // this property is optional
    customizedLogger: customizedLogger,
    // There are three levels available - DEBUG, INFO, ERROR. Default is INFO
    level: connect.LogLevel.INFO,
    // Choose if you want to use the default logger
    useDefaultLogger: true
  }
};
  
connect.ChatSession.setGlobalConfig(globalConfig);
```
### Theme
To customize the theme, determine which aspect(s) of the chat interface you would like to modify, make your changes and build the file as described above.

Occasionally, a component will pull a style value from `src/theme/defaultTheme.js`, so it is important to be aware of this source of customization.

See below sections for high level description of each major component.

### Message Receipts

Render and send read/delivered message receipts with feature enabled in [your connect instance](https://docs.aws.amazon.com/connect/latest/adminguide/message-receipts.html). Related files are listed below.

 - [`index.js`](./src/index.js): enable/disable or set throttling time for sending message-receipts
 - [`ChatTranscriptor.js`](./src/components/Chat/ChatTranscriptor/ChatTranscriptor.js) + [`Utils.js`](./src/components/Chat/datamodel/Utils.js): update the model to parse API response and find read/delivered receipt 
 - [`ChatMessage.js`](./src/components/Chat/ChatTranscriptor/ChatMessages/ChatMessage.js): use `react-intersection-observer` to send read receipt and handle display logic
 - [`ChatSession.js`](./src/components/Chat/ChatSession.js): add read/delivered eventHandlers for ChatJs handshake and sending receipt for last message
 - [`ChatJs`](https://github.com/amazon-connect/amazon-connect-chatjs): use latest version with updated feature [configuration](https://github.com/amazon-connect/amazon-connect-chatjs#connectchatsessionsetglobalconfig)

![View receipts](./screenshots/view-receipts.png)

### Rich Text Formatting
Send and receive messages with rich text formatting. Render the rich toolbar used to apply markdown styling and display the emoji picker.

Enable/disable feature by updating the `initiateChat()` config:

```diff
connect.ChatInterface.initiateChat({
    ...backendEndpoints,
    // ...
    featurePermissions: {
        ATTACHMENTS: false,
    },
+   supportedMessagingContentTypes: "text/plain,text/markdown", // default: "text/plain"
});
```

Referencing [PR#92](https://github.com/amazon-connect/amazon-connect-chat-interface/pull/92/files), the following additions are needed for rich messaging support:
 - [`ChatInitiator.js`](./src/components/Chat/ChatInitiator.js): pass `input.supportedMessagingContentTypes` to [StartChat](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) request
 - [`ChatTranscriptor.js`](./src/components/Chat/ChatTranscriptor/ChatMessages/ChatMessage.js): implement `<RichMessageRenderer />` for markdown messages
 - [`ChatComposer.js`](./src/components/Chat/ChatComposer/ChatComposer.js) + [`Model.js`](./src/components/Chat/datamodel/Model.js): implement `<RichTextEditor />` and the toolbar, passing `ContentType: "text/markdown"` in sendMessage event
 - [`RichMessageComponents`](./src/components/Chat/RichMessageComponents): currently uses pre-built components with [draft-js](https://www.npmjs.com/package/draft-js), [emoji-mart](https://www.npmjs.com/package/emoji-mart) and [markdown-draft-js](https://www.npmjs.com/package/markdown-draft-js)
 <!-- TODO: replace with reusable components - https://app.asana.com/0/1203611591691532/1203611591691556/f -->

![Chat Widget with rich messaging enabled screenshot](./screenshots/send-rich-messages.png)

### Custom Chat Duration

Learn more about chat duration: https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html#connect-StartChatContact-request-ChatDurationInMinutes

You can set custom chat duration by updating the `initiateChat()` config:

```diff
connect.ChatInterface.initiateChat({
    ...backendEndpoints,
    // ...
+   chatDurationInMinutes: 1500, // min 60, max 10080 - default 1500 (25 hours)
    // ...
});
```

### Audio Notifications
A commonly requested feature for the Connect Chat Interface is to play a sound when a new message is received from the agent. This can be done via the ![ChatJs](https://github.com/amazon-connect/amazon-connect-chatjs#chatsessiononmessage) `onMessage` event.

An implementation might look like the following, in the constructor of `ChatSession.js` (although you can set this up anywhere you have access to the ChatJs `chatSession` object):
```js
const audioObj = new Audio('my-notification-sound.mp3');

this.session.onMessage(event => {
  const { chatDetails, data } = event;
  if (data.ParticipantRole === "AGENT") {
    audioObj.play();
  }
});
```

Note that for larger audio files you may need to more gracefully handle when the audio is actually available to play: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio#determining_when_playback_can_begin.


## Components
High level overview of some of the major components below, to help understand the chat interface.

### Chat.js (src/components/Chat)
Chat.js serves as the top level UI wrapper for the chat experience. It contains the styling for the `Header`, and invokes the `ChatTranscriptor`, `ChatComposer`, and `ChatActionBar`. 

For example, we can update the Header background color by updating the background to red in `Chat.js`.
```
const HeaderWrapper = styled.div`
  background: #3F5773;
  text-align: center;
  padding: 20px;
  color: #fff;
  border-radius: 3px;
`
```

**Before**:

<img src="./screenshots/default-blue-header.png" width=250px>

**After**:

<img src="./screenshots/red-header.png" width=250px>

### Chat Transcriptor (src/components/Chat/ChatTranscriptor)
The Chat Transcriptor is responsible for rendering the transcript of the Chat in the widget. It handles typing events, sent messages, received messages, and scrolling.

Make changes here to update message bubbles, chat background, and more.

### Chat Action Bar
The action bar covers the UI underneath the chat input area. For the default chat widget experience, it contains the functionality to end a chat and close the chat window.

A customization to the action bar background in this file to `palette.lightGreen` might look as follows:

<img src="./screenshots/green-action-background.png" width=250px>

### Chat Composer
The chat composer is responsible for the editable text area where the customer constructs and sends their messages. 

Changes can be made here for the hint text ("Type a message"), as well as the edit container styles.

Example changing `FormattedMessage` hint text to "What's on your mind?":

<img src="./screenshots/hint-text-composer.png" width=250px>

## Interactive message

Interactive messages are rich messages that present a prompt and pre-configured display options for a customer to choose. These messages are powered by Amazon Lex and configured through Amazon Lex using a Lambda. [Learn more](https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html)

### Implement action buttons in interactive message

Currently the max number of list picker options that return from server(via Lex) is 6(10 for panel picker), but our customers would like to provide more options to their end customers. In order to achieve this goal, we have implemented the idea of "Show more" and "Previous options" buttons in our interactive message UI. These changes will require customers to provide some new data when they configure the interactive message so that they are able to use this new feature. [Learn more about setting up action buttons](./.github/docs/InteractiveMessageActionButtonImplementation.md)

<img src="./screenshots/interactive-message-action-buttons.png" width=250px>