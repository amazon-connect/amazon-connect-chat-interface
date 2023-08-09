# Custom Chat Duration

Set custom total duration of the newly started chat session. This enables you to define how long your customers have to resume a chat interaction before it expires. 

Learn more about chat duration: [StartChatContact#ChatDurationInMinutes](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html#connect-StartChatContact-request-ChatDurationInMinutes)

## Reference

 - Initial release date: 1/31/2022
 - [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html#connect-StartChatContact-request-ChatDurationInMinutes)
 - [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2022/01/amazon-connect-chat-duration-7-days/)

## Configuration

Set custom `chatDurationInMinutes` in the `initiateChat()` config:

```diff
connect.ChatInterface.initiateChat({
    name: customerName,
    region,
    apiGatewayEndpoint,
    instanceId,
    contactFlowId,
    // ...
+   chatDurationInMinutes: 1500, // default 1500 (25 hours) - min 60 (1 hour), max 10080 (7 days)
});
```
