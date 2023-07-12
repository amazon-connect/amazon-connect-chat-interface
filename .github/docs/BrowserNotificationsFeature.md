# Browser Notifications

The chat widget supports browser notifications for your customers through their desktop devices. Specifically, your customers will receive a notification through their web browser when they receive a new message, but are not active on the webpage that contains the chat window. When your customers click or tap this notification, they are automatically redirected to the webpage containing the chat window. Your customers can enable or disable notifications at the start of each chat conversation.

Both of these features are automatically included in the chat widget. You don't need to perform any steps to make them available to your customers.

![TODO](/.github/screenshots/browser-widget-notification-example.png)

## Reference

 - Initial release date: n/a
 - Admin Guide Documentation: ["Browser notifications"](https://docs.aws.amazon.com/connect/latest/adminguide/message-receipts.html)

## Example

This will work for the out-of-box Amazon Connect hosted widget, from the html snippet provided in the Connect Admin console:

```js
<script type="text/javascript">
  (function(w, d, x, id){
    s=d.createElement('script');
    s.src='https://d2s9x5slbvr0vu.cloudfront.net/amazon-connect-chat-interface-client.js';
    s.async=1;
    s.id=id;
    d.getElementsByTagName('head')[0].appendChild(s);
    w[x] =  w[x] || function() { (w[x].ac = w[x].ac || []).push(arguments) };
  })(window, document, 'amazon_connect', '360f3075-92ac-4648-adfe-84ee860c3bfd');
  amazon_connect('styles', { openChat: { color: '#ffffff', backgroundColor: '#07b62a'}, closeChat: { color: '#ffffff', backgroundColor: '#07b62a'} });
  amazon_connect('snippetId', 'QXA1ZnBvMU9ST3F6MXhz...QlhGbUdtbVY5RXV2dXNMT0JTQkVLdz0=');
  amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
</script>
```