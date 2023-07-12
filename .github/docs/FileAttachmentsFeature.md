# File Attachments

> ‼️ MUST ENABLE this feature for [your Connect instance]([https://docs.aws.amazon.com/connect/latest/adminguide/message-receipts.html](https://docs.aws.amazon.com/connect/latest/adminguide/enable-attachments.html))

Allow customers and agents to share files using chat. Refer to Admin Guide documentation to [enable attachments for you Connect instance](https://docs.aws.amazon.com/connect/latest/adminguide/enable-attachments.html)

<img width="222" alt="Chat Attachments Feature" src="/.github/screenshots/chat-attachments-screenshot.png">

## Reference

 - Initial release date: 12/21/2020
 - [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/enable-attachments.html)
 - [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2020/12/amazon-connect-now-supports-sharing-attachments-in-chat/)


## Implementation

If you want to enable sending attachments for Amazon Connect Chat the customer chat widget, follow the instructions in the documentation to enable your Amazon Connect instance for attachments. Once enabled, you can mark the ATTACHMENTS flag in connect.ChatInterface.initiateChat as true. Example below:

```diff
connect.ChatInterface.initiateChat({
  apiGatewayEndpoint: "https://${apiId}.execute-api.${region}.amazonaws.com/Prod",
  contactFlowId: "${contactFlowId}",
  instanceId: "${instanceId}",
  // ...
+ featurePermissions: {
+   "ATTACHMENTS": true,  // this is the override flag from user for attachments
+ }
},successHandler, failureHandler);
```

## Common Issues

Internal firewall prevents access to chat attachments
? Please refer to https://docs.aws.amazon.com/connect/latest/adminguide/ts-agent-attachments.html

## Limits

> Please refer to [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/feature-limits.html#feature-limits-chat) for latest Chat feature limits

File types supported for chat attachments:
```
.csv, .doc, .docx, .jpeg, .jpg, .pdf, .png, .ppt, .pptx, .txt, .wav, .xls, .xlsx
```

Max file size for a chat attachment:

```
20MB
```

