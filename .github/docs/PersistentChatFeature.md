# Persistent Chat

> ⚠️ Only chat sessions that have ended are allowed to rehydrate onto a new chat session.

Persistent chats enable customers to resume previous conversations with the context, metadata, and transcripts carried over, eliminating the need for customers to repeat themselves and allowing agents to provide personalized service with access to the entire conversation history. To set up persistent chat experiences, simply provide a previous contact id when calling the StartChatContact API to create a new chat contact.

Learn more about persistent chat: https://docs.aws.amazon.com/connect/latest/adminguide/chat-persistence.html

## Reference

 - Initial release date: 1/20/2023
 - [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/chat-persistence.html)
 - [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2023/01/amazon-connect-persistent-chat-experiences/)

## Configuration

Chat transcripts are pulled from previous chat contacts, and displayed to the customer and agent.

Set the `persistentChat` in the `initiateChat()` config:

```diff
connect.ChatInterface.initiateChat({
    name: customerName,
    region,
    apiGatewayEndpoint,
    instanceId,
    contactFlowId,
    // ...
    // Learn more about persistent chat: https://docs.aws.amazon.com/connect/latest/adminguide/chat-persistence.html
+   persistentChat: {
+       rehydrationType: "", // TODO: ENTIRE_PAST_SESSION or FROM_SEGMENT
+       // For the ENTIRE_PAST_SESSION rehydration type, specify the first contact (initial contactId) of the past chat session as the SourceContactId attribute.
+       // For the FROM_SEGMENT rehydration type, specify any contactId of the past chat session as the SourceContactId attribute.
+       sourceContactId: "" // TODO: Fill in contactId based on rehydrationType
+   },
});
```

### StartChatContact API Request

> For latest documentation, please follow instructions in ["Admin guide: Enable persistent chat"](https://docs.aws.amazon.com/connect/latest/adminguide/chat-persistence.html)

To enable persistent chat, provide the previous `contactId` in the `SourceContactId` parameter of [`StartChatContact`](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) API.

```http
PUT /contact/chat HTTP/1.1
Content-type: application/json
{
   "Attributes": { 
      "string" : "string" 
   },
   "ContactFlowId": "string",
   "InitialMessage": { 
      "Content": "string",
      "ContentType": "string"
   },
   "InstanceId": "string",
   ... // other chat fields
     
   // NEW Attribute for persistent chat 
   "PersistentChat" : {
       "SourceContactId": "2222222-aaaa-bbbb-2222-222222222222222" 
       "RehydrationType": "FROM_SEGMENT" // ENTIRE_PAST_SESSION | FROM_SEGMENT
   }
}
```