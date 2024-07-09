# Amazon Connect Chat Interface Documentation

Looking to build a custom chat-interface for Amazon Connect Chat? Learn how to set up this package for local development, see overview of React components, and enable/configure existing features.

> For additional common features (e.g. customer name from a form), check out the [customChatWidget](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/customChatWidget) example.

## Table of contents

- [Documentation](#official-aws-documentation) - additional documentation reference
- [Features](#features) - overview of global configuration options (logger, feature flags, etc)
- [Customization](#customization)- high level overview of some of the major components
- [Components](#customization) - details on how to enable/use various features

## Official AWS Documentation

- [StartChatConact API Backend (CFN Template)](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI)
- [Custom Chat Widget Example App](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/customChatWidget)
- [Amazon Connect Chat Experience Admin Guide](https://docs.aws.amazon.com/connect/latest/adminguide/enable-chat-in-app.html)
- [Amazon Connect Open Source Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/download-chat-example.html)
- [Out-of-box Amazon Connect Chat Widget Setup](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html)

## Features

- **Message Receipts** - render and send read/delivered message receipts. Please see [`MessageReceiptsFeature.md`](.github/docs/MessageReceiptsFeature.md) for more details.

<p align="center">
  <img src="/.github/screenshots/hosted-widget-read-receipt.png" width="150px">
</p>

- **Rich Text Formatting** - send and receive messages with rich text formatting. Please see [`RichTextFormatting.md`](.github/docs/RichTextFormattingFeature.md) for more details

<p align="center">
<img src="/.github/screenshots/send-rich-messages.png" width="150px">
</p>

- **Interactive Messages** - rich messages for chat rather than plain text, configured with Amazon Lex Bot + Lambda. Please see [`InteractiveMessageFeature.md`](.github/docs/InteractiveMessageFeature.md) for more details.

<p align="center">
<img src="/.github/screenshots/host-widget-interactive-message.png" width="150px">
</p>

- **File Attachments** - allow customers and agents to share files using chat. Please see [`FileAttachmentsFeature.md`](.github/docs/FileAttachmentsFeature.md) for more details.

<p align="center">
<img src="/.github/screenshots/host-widget-attachments.png" width="150px">
</p>

- **Custom Chat Duration** - set custom total duration of the newly started chat session. Please see [`CustomChatDurationFeature.md`](.github/docs/CustomChatDurationFeature.md) for more details.

- **Audio Notifications** - play a sound when a new message is received from the agent. Please see [`AudioNotificationsFeature.md`](.github/docs/AudioNotificationsFeature.md) for more details.

- **Persistent Chat** - allow customers to resume previous conversations with the context, metadata, and transcripts carried forward to the next agent. Please see [`PersistentChatFeature.md`](.github/docs/PersistentChatFeature.md) for more details.

- **Passing Attribute to Contact Flow** - pass custom attributes to the the contact flow in the StartChatContact request. Please see [`PassingAttributeToContactFlow.md`](.github/docs/PassingAttributeToContactFlow.md) for more details

- **Step by Step Guides in Chat** - interact with step-by-step guides in a chat widget. Please see [`StepByStepGuidesInChatFeature.md`](.github/docs/StepByStepGuidesInChatFeature.md) for more details.

## Customization

### Chat Interface Configuration

Parameters that can be passed to `ChatInterface.initiateChat()`, which is parsed for the `StartChatContact` request [[Learn More](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html#connect-StartChatContact-request-Attributes)].

```js
/**
 * Initiate a chat session within Amazon Connect
 *
 * @param {Object} input - data to initiate chat
 * @param {string} input.instanceId
 * @param {string} input.contactFlowId
 * @param {string} input.apiGatewayEndpoint
 * @param {string} input.name
 * @param {string} input.region
 * @param {string} input.initialMessage - (optional) initial message to start chat
 * @param {string} input.contactAttributes - (optional)
 * @param {object} input.headers - (optional)
 * @param {string} input.supportedMessagingContentTypes - (optional)
 * @param {number} input.chatDurationInMinutes - (optional)
 */

connect.ChatInterface.initiateChat({
  instanceId: "${instanceId}",
  contactFlowId: "${contactFlowId}",
  apiGatewayEndpoint: "https://${apiId}.execute-api.${region}.amazonaws.com/Prod",
  region: ${region},
  name: "${customerName}",
  initialMessage: "Please help!",
  contactAttributes: JSON.stringify({  // a custom key-value pair - docs: https://docs.aws.amazon.com/connect/latest/adminguide/pass-contact-attributes-chat.html
    "customerName": "${customerName}",
    "passThisToContactFlow": "${passThisToContactFlow}",
  }),
  headers: {
    'Content-Type': 'application/json', // for example
  },
  supportedMessagingContentTypes: "text/plain,text/markdown", // default "text/plain" - include 'text/markdown' for rich messaging support
  chatDurationInMinutes: 1500, // default 1500 (25 hours) - min 60 (1 hour), max 10080 (7 days)
  featurePermissions: {
    "ATTACHMENTS": true, // enabled attachments feature (file upload)
   }
},successHandler, failureHandler)
```

### Chat Session Logger Configuration

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

```js
// Add your own logger function here
var customizedLogger = {
  debug: (data) => {
    /* customize logger function here */
  },
  info: (data) => {
    /* customize logger function here */
  },
  error: (data) => {
    /* customize logger function here */
  },
};

connect.ChatSession.setGlobalConfig({
  loggerConfig: {
    // You can provide your own logger here, otherwise
    // this property is optional
    customizedLogger: customizedLogger,
    // There are three levels available - DEBUG, INFO, ERROR. Default is INFO
    level: connect.LogLevel.INFO,
    // Choose if you want to use the default logger
    useDefaultLogger: true,
  },
});
```

### Chat Session Global Configuration

```js
/**
 * Set the global configuration for the chat session
 *
 * @param {Object} input - data to set global configuration
 * @param {string} input.region - (optional) AWS region for the Amazon Connect service (default: "us-west-2")
 * @param {Object} input.loggerConfig - (optional) configuration object for the logger, see "Logger Configuration" section
 * @param {Object} input.features - (optional) configuration object for various features
 * @param {Object} input.csmConfig - (optional) additional configuration for the client-side-metrics
 */

connect.ChatSession.setGlobalConfig({
  region: "us-east-1", // optional, defaults to: "us-west-2"
  loggerConfig: {
    /* ... */
  },
  features: {
    messageReceipts: {
      /* ... */
    }, // for example - refer to "Features" section for more detail
  },
  csmConfig: {
    widgetType: "CustomBuildChatWidget",
  },
});
```

### Theme

To customize the theme, determine which aspect(s) of the chat interface you would like to modify, make your changes and build the file as described above.

Occasionally, a component will pull a style value from `src/theme/defaultTheme.js`, so it is important to be aware of this source of customization.

See below sections for high level description of each major component.

## Components

High level overview of some of the major components below, to help understand the chat interface.

<img src="/.github/screenshots/chat-components-diagram.png" width="400px">

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

<img src="/.github/screenshots/default-blue-header.png" width=250px>

**After**:

<img src="/.github/screenshots/red-header.png" width=250px>

### Chat Transcriptor (src/components/Chat/ChatTranscriptor)

The Chat Transcriptor is responsible for rendering the transcript of the Chat in the widget. It handles typing events, sent messages, received messages, and scrolling.

Make changes here to update message bubbles, chat background, and more.

### Chat Action Bar

The action bar covers the UI underneath the chat input area. For the default chat widget experience, it contains the functionality to end a chat and close the chat window.

A customization to the action bar background in this file to `palette.lightGreen` might look as follows:

<img src="/.github/screenshots/green-action-background.png" width=250px>

### Chat Composer

The chat composer is responsible for the editable text area where the customer constructs and sends their messages.

Changes can be made here for the hint text ("Type a message"), as well as the edit container styles.

Example changing `FormattedMessage` hint text to "What's on your mind?":

<img src="/.github/screenshots/hint-text-composer.png" width=250px>
