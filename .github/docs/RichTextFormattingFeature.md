# Rich Text Formatting

> ‼️ MUST ENABLE this feature for your `initiateChat()` config ["see "[Configuration](#Configuration)"]

Send and receive messages with rich text formatting. By default, customer will send "text/plain" to agent.

![Chat Widget with rich messaging enabled screenshot](/.github/screenshots/send-rich-messages.png)

## Reference

- Initial release date: 3/14/2022
- [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/enable-text-formatting-chat.html)
- [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2022/03/amazon-connect-rich-chat-formatting/)

## Specification

Supported formatting (see [Basic Markdown Syntax](https://www.markdownguide.org/basic-syntax/))

- Bold
- Italic
- Bulleted list
- Numbered list
- Hyperlinks
- Emoji

<img width="350px" alt="Chat Widget with rich messaging enabled screenshot" src="/.github/screenshots/rich-messaging-example-message.png">

```
This is some *emphasized text* and some **strongly emphasized text**

This is a bulleted list (multiline):
* item 1
* item 2
* item 3

This is a numbered list:
1. item 1
2. item 2
3. item 3

Questions? Visit https://plainlink.com/faq

[This is a link](https://aws.amazon.com)

This is <code />
```

```js
const SingleLinePickerSubtitle =
  "This is some *emphasized text* and some **strongly emphasized text**\r\nThis is a bulleted list:\n* item 1\n* item 2\n* item 3\n\nThis is a numbered list:\n1. item 1\n2. item 2\n3. item 3\n\nQuestions? Visit https://plainlink.com/faq\r\n[This is a link](https://aws.amazon.com)\r\nThis is `<code />`";
```

## Configuration

Enable/disable feature by updating the `initiateChat()` config:

> This will render the rich toolbar used to apply markdown styling and display the emoji picker.

```diff
connect.ChatInterface.initiateChat({
    name: customerName,
    region,
    apiGatewayEndpoint,
    instanceId,
    contactFlowId,
    // ...
+   supportedMessagingContentTypes: "text/plain,text/markdown", // default: "text/plain"
});
```

### StartChatContact Lambda Updates

> ‼️ If using the [StartChatContact Lambda CloudFormation ui-example template](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI), you need to make sure to add this change:

```diff
// https://github.com/amazon-connect/amazon-connect-chat-ui-examples/pull/88/files#diff-869a2945b96e9ec51371b0c2895f164a9212a4d09c55a4453ee68243e146e2bc

function startChatContact(contactFlowId, username, body, instanceId) {
    return new Promise(function (resolve, reject) {
        var startChat = {
            "InstanceId": instanceId == "" ? process.env.INSTANCE_ID : instanceId,
            "ContactFlowId": contactFlowId == "" ? process.env.CONTACT_FLOW_ID : contactFlowId,
            },
            "ParticipantDetails": {
                "DisplayName": body["ParticipantDetails"]["DisplayName"]
            },
+           ...(!!body["SupportedMessagingContentTypes"] && { "SupportedMessagingContentTypes": body["SupportedMessagingContentTypes"] })
        };

        connect.startChatContact(startChat, function(err, data) { } );
    });
}
```

## Example Messages

Plain Text Transcript Message (existing behavior):

```js
{
    id: "asdf9374asdf92749adsf",
    type: PARTICIPANT_MESSAGE, // "MESSAGE"
    transportDetails: {
        direction: "Incoming",
    },
    content: {
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_PLAIN, // "text/plain"
        data: "This is just plain text message"
    }
}
```

Rich Text Transcript Message (new behavior):

```js
{
    id: "asdf9374asdf92749adsf",
    type: PARTICIPANT_MESSAGE, // "MESSAGE"
    transportDetails: {
        direction: "Incoming",
    },
    content: {
        type: ContentType.MESSAGE_CONTENT_TYPE.TEXT_MARKDOWN, // "text/markdown"
        data: "*italic* **bold**"
    }
}
```

## Related Code Changes

> `amazon-connect-chatjs@^1.1.9` supports rich messaging with no additional configuration. [[ref](https://github.com/amazon-connect/amazon-connect-chatjs/pull/76/files)]

Referencing [PR#92](https://github.com/amazon-connect/amazon-connect-chat-interface/pull/92/files), the following additions are needed for rich messaging support:

- [`ChatInitiator.js`](./src/components/Chat/ChatInitiator.js): pass `input.supportedMessagingContentTypes` to [StartChat](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) request
- [`ChatTranscriptor.js`](./src/components/Chat/ChatTranscriptor/ChatMessages/ChatMessage.js): implement `<RichMessageRenderer />` for markdown messages
- [`ChatComposer.js`](./src/components/Chat/ChatComposer/ChatComposer.js) + [`Model.js`](./src/components/Chat/datamodel/Model.js): implement `<RichTextEditor />` and the toolbar, passing `ContentType: "text/markdown"` in sendMessage event
- [`RichMessageComponents`](./src/components/Chat/RichMessageComponents): currently uses pre-built components with [draft-js](https://www.npmjs.com/package/draft-js), [emoji-mart](https://www.npmjs.com/package/emoji-mart) and [markdown-draft-js](https://www.npmjs.com/package/markdown-draft-js)
<!-- TODO: replace with reusable components - https://app.asana.com/0/1203611591691532/1203611591691556/f -->
