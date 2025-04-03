# Message Receipts

> ‼️ MUST ENABLE this feature for [your Connect instance](https://docs.aws.amazon.com/connect/latest/adminguide/message-receipts.html)

Render and send read/delivered message receipts. Enabled by default in ChatInterface + [ChatJS](https://github.com/amazon-connect/amazon-connect-chatjs)

Message receipts use [sendEvent API](https://docs.aws.amazon.com/connect-participant/latest/APIReference/API_SendEvent.html) for sending Read/Delivered events

![View receipts](/.github/screenshots/hosted-widget-read-receipt.png)

## Reference

 - Initial release date: 12/29/2022
 - [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/message-receipts.html)
 - [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2022/12/amazon-connect-enables-showing-message-receipts-chat-experience/)


## Implementation Resources

 - Official Docs: [Enabling Message Receipts Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/message-receipts.html)
 - ParticipantService API Reference: [SendEvent](https://docs.aws.amazon.com/connect-participant/latest/APIReference/API_SendEvent.html)
 - ParticipantService API Reference: [Receipt](https://docs.aws.amazon.com/connect-participant/latest/APIReference/API_Receipt.html)
 - ParticipantService API Reference: [MessageMetadata](https://docs.aws.amazon.com/connect-participant/latest/APIReference/API_MessageMetadata.html)

## Configuration

### Disable Message Receipts

Enabling/disable message-receipts (Read/Delivered) for messages in `setGlobalConfig()`:

```js
connect.ChatSession.setGlobalConfig({
  loggerConfig: { /* ... */ },
  /* ... */
  features: {
    messageReceipts: {
      shouldSendMessageReceipts: true, // DEFAULT: true, set to false to disable Read/Delivered receipts
    }
  }
});
```

### Custom Throttle Time

To customize wait time before sending read/delivered receipt, set the throttle in global config:

```js
connect.ChatSession.setGlobalConfig({
  loggerConfig: { /* ... */ },
  /* ... */
  features: {
    messageReceipts: {
      shouldSendMessageReceipts: true, // DEFAULT: true
      throttleTime: 5000 //default throttle time - time to wait before sending Read/Delivered receipt.
    }
  }
});
```

## Related Code Changes

Refer to [PR #80](https://github.com/amazon-connect/amazon-connect-chat-interface/pull/80) for related code changes.  Note-able files are listed below:

 - [`index.js`](/src/index.js): enable/disable or set throttling time for sending message-receipts
 - [`ChatTranscriptor.js`](/src/components/Chat/ChatTranscriptor/ChatTranscriptor.js) + [`Utils.js`](/src/components/Chat/datamodel/Utils.js): update the model to parse API response and find read/delivered receipt 
 - [`ChatMessage.js`](/src/components/Chat/ChatTranscriptor/ChatMessages/ChatMessage.js): use `react-intersection-observer` to send read receipt and handle display logic
 - [`ChatSession.js`](/src/components/Chat/ChatSession.js): add read/delivered eventHandlers for ChatJS handshake and sending receipt for last message
 - [`ChatJS`](https://github.com/amazon-connect/amazon-connect-chatjs): use latest version with updated feature [configuration](https://github.com/amazon-connect/amazon-connect-chatjs#connectchatsessionsetglobalconfig)
