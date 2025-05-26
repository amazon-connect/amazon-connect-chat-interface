# Host Widget Snippet Integrated Custom UI (S3 Bucket/CDN)

## Overview

Fork the open-souce [GitHub Chat Interface](https://github.com/amazon-connect/amazon-connect-chat-interface) and customize your own customer chat UI. Import the custom bundle file into the pre-built [Amazon Connect Hosted Widget](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html). The hosted widget will handle all the backend logic and [StartChatContact](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) API requests, allowing you to focus on the UI development.

You'll need to fork the [GitHub Chat Interface](https://github.com/amazon-connect/amazon-connect-chat-interface) and generate a custom bundle file: `amazon-connect-chat-interface.js`

> 📍 Please note, [pre-built Hosted Widget](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html) Chat Interface is a different code base than this Github Chat Interface. We try to release the newest feature, but we do not guarantee the latest internal features are available on GitHub. Github Chat Interface is provided as-is, and it's inteded to be a fully-functional boilerplate for an Amazon Connect Chat UI.

## References

- [Amazon Connect Open Source Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/download-chat-example.html)
- [Amazon Connect Chat Experience Admin Guide](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html)

## Prerequisites

- an Amazon Connect Instance [[guide](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-instances.html)]

- an Amazon Connect Contact Flow, ready to receive chat contacts. [[guide](https://docs.aws.amazon.com/connect/latest/adminguide/chat.html)]

    - For demo purposes, you can start with the ["Sample Inbound Flow (First Contact)"](https://docs.aws.amazon.com/connect/latest/adminguide/sample-inbound-flow.html)

## Setup
1. If you don't already have a Chat Widget instance in your AWS account, please set one up by following this [AWS Guide](https://docs.aws.amazon.com/connect/latest/adminguide/tutorial1-set-up-your-instance.html).

2. On the Chat Widget Panel, you can see your Chat widget script.
![Alt text](/.github/screenshots/built-in-script-setup-steps-lmaw.jpg)

3. You can customize and upload your `amazon-connect-interface.js` file to your own S3 bucket or any storage server. Follow [customize interface.js steps](https://github.com/amazon-connect/amazon-connect-chat-interface/blob/master/DOCUMENTATION.md#features) to customize `amazon-connect-interface.js`.

    - 3-1. Build your own amazon-connect-chat-interface.js and upload it in your S3 bucket.
    ![Alt text](/.github/screenshots/built-in-script-setup-steps-s3.jpg)
    - 3-2. Bucket access should be public.
    ![Alt text](/.github/screenshots/built-in-script-setup-steps-s3-public.jpg)

4. Now, with just one line of script added to your Chat Widget script, you can use `amazon-conncet-chat-interface.js` in your chat widget.
    - 4-1. Copy the link to customized `amazon-connect-chat-interface.js`.
    ![Alt text](/.github/screenshots/built-in-script-setup-steps-s3-url.jpg)

    - 4-2. Use the link as a parameter in the following script. Include this script along with your Chat Widget script and paste it into your website file.

        ```
        amazon_connect('customerChatInterfaceUrl', 'https://...'); // TODO: put in your link to amazon-connect-chat-interface.js
        ```

5. You should see the source of `amazon-connect-chat-interface.js` is now your file.

    - Before(using Amazon default `amazon-connect-chat-interface.js`):
    ![Alt text](/.github/screenshots/built-in-script-setup-steps-web-resource.jpg)

    - After (using your customized  `amazon-connect-chat-interface.js`):
    ![Alt text](/.github/screenshots/built-in-script-setup-steps-result.jpg)

## Usage

Host your own `amazon-connect-chat-interface.js` bundle file and provide the link in the widget snippet configuration. Retrieve this snippet code from the Connect Admin Console: [Documentation - "Chat widget script"](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html#chat-widget-script)

```diff
<!-- EXAMPLE SNIPPET -->

<script type="text/javascript">
  (function(w, d, x, id){s=d.createElement('script');s.src='https://d2s9x5slbvr0vu.cloudfront.net/amazon-connect-chat-interface-client.js';s.async=1;s.id=id;d.getElementsByTagName('head')[0].appendChild(s);w[x]=w[x]||function(){(w[x].ac=w[x].ac||[]).push(arguments)}})(window, document, 'amazon_connect', 'asdfasdfasdf');

  amazon_connect('styles', { openChat: { color: '#ffffff', backgroundColor: '#07b62a'}, closeChat: { color: '#ffffff', backgroundColor: '#07b62a'} });
  amazon_connect('snippetId', 'asdfsadfasdf...');
  amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
+ amazon_connect('customerChatInterfaceUrl', 'https://...'); // TODO: put in your link to amazon-connect-chat-interface.js
  // Local file is also supported: './amazon-connect-chat-interface.js'
</script>
```
