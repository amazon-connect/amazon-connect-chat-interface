## Step by Step Guides in Chat
Interact with Step-by-step Guides in a chat widget.
## Reference
 - AWS Documentation: ["Step-by-step Guides"](https://docs.aws.amazon.com/connect/latest/adminguide/step-by-step-guided-experiences.html)
 - [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2024/03/amazon-connect-guided-chat-experiences-step-by-step-guides/)

### With Approach 1 (Host Widget Snippet Integrated Custom UI (S3 Bucket/CDN))
1. Ensure that the communication widget has support for interactive messages.
eg:
```
amazon_connect('supportedMessagingContentTypes', [ 'application/vnd.amazonaws.connect.message.interactive','application/vnd.amazonaws.connect.message.interactive.response' ])
```
2. Ensure to use an updated amazon-connect-chat-interface which has built in support for guides in chat.
### With Approach 2 (Customized Widget and Chat Interface UI (Self-Hosted))
1. Provide the instance alias and configuration to the init function:
```
// Initialize the chat widget
connect.ChatInterface.init({
  containerId: rootElemId, // This is the id of the container where you want the widget to reside
  guidesInChat: {
    instanceAlias: 'instanceAlias', // This is the alias of your connect instance
    version: 'latest' // optional and defaults to latest. This is the version of the guides renderer to be fetched
  }
});
```
2. Ensure to add interactive messages to the supportedMessagingContentTypes configuration. eg:
```
supportedMessagingContentTypes: "application/vnd.amazonaws.connect.message.interactive,application/vnd.amazonaws.connect.message.interactive.response"
```
Guides in chat works by fetching the guides renderer to be used in the chat widget with the above configuration. Guides in chat will not work without providing instanceAlias in guidesInChat config.

The version (defaults to 'latest' when not provided) corresponds to the version of the guides renderer to be fetched. 'latest' will fetch the up to date renderer and is the only supported version as of today.

The version can be specified (eg: 2.3.4) when versions of the renderer is released.