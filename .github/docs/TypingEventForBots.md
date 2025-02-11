# Typing Event For Bots

Show typing indicator for Lex and Custom Bot messages.
:wq
<img width="222" alt="Typing Event For Bots Feature" src="/.github/screenshots/typing.gif">

## Implementation

If you want to enable showing typing event for Lex / Custom bots mark the `TYPING_EVENT_FOR_BOTS` flag in `connect.ChatInterface.initiateChat` as `true`. Example below:

```diff
connect.ChatInterface.initiateChat({
  apiGatewayEndpoint: "https://${apiId}.execute-api.${region}.amazonaws.com/Prod",
  contactFlowId: "${contactFlowId}",
  instanceId: "${instanceId}",
  // ...
+ featurePermissions: {
+   "TYPING_EVENT_FOR_BOTS": true,
+ }
},successHandler, failureHandler);
```

