# Amazon Connect Chat Interface 
[![Node.js CI](https://github.com/amazon-connect/amazon-connect-chat-interface/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/amazon-connect/amazon-connect-chat-interface/actions/workflows/node.js.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) ![Bundle Size](https://img.shields.io/github/size/amazon-connect/amazon-connect-chat-interface/local-testing/amazon-connect-chat-interface.js?color=green&label=Bundle%20Size)


Amazon Connect Chat Interface is a light interface to create a customer widget for getting started with Amazon Connect chat. This package contains
some lightweight components to render chat out of the box in your website, with a thin layer on top of [ChatJS](https://github.com/amazon-connect/amazon-connect-chatjs)
to manage your chat session.

**New to Amazon Connect and looking to onboard with Chat/Messaging capabilities?** Refer to the [“Amazon Connect Chat Open Source Walkthrough”](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/blob/master/.github/docs/AmazonConnectChatOpenSourceWalkthrough.md) documentation. We have the following three approaches to get started:

![](.github/screenshots/amazon-connect-chat-interface-open-source-diagram.png)

## Documentation

### - [Features](./DOCUMENTATION.md#features) - details on how to enable/use various features

### - [Customization](./DOCUMENTATION.md#customization) - overview of global configuration options (logger, feature flags, etc)

### - [Components](./DOCUMENTATION.md#components) - high level overview of some of the major components

## Usage

### Approach 1: Pre-built Amazon Connect Hosted Widget Snippet

> Follow the Admin Guide Documentation: https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html

Add a chat widget to your website that is hosted by Amazon Connect. You can configure the chat widget in the Amazon Connect console: customize the font and colors, and secure the widget so that it can be launched only from your website. As a result, you will have a short code snippet that you add to your website, with latest version always live on your website.

```html
<script type="text/javascript">
  (function(w, d, x, id){s=d.createElement('script');s.src='https://1234lbvr0vu.cloudfront.net/amazon-connect-chat-interface-client.js';s.async=1;s.id=id;d.getElementsByTagName('head')[0].appendChild(s);w[x]=w[x]||function(){(w[x].ac=w[x].ac||[]).push(arguments)}})(window, document, 'amazon_connect', '360f3075-asfd-asfd-asdf-asdf');
  
  amazon_connect('styles', { openChat: { color: '#ffffff', backgroundColor: '#07b62a'}, closeChat: { color: '#ffffff', backgroundColor: '#07b62a'} });
  amazon_connect('snippetId', 'asdf1234asdf1234adsf1234=');
  amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
</script>
```

![Hosted Widget Snippet UI](/.github/screenshots/hosted-widget-chat-interface-screenshot.png)

### Approach 2: Host Widget Snippet Integrated Custom UI (S3 Bucket/CDN)

> ❗ IMPORTANT: follow steps listed in [HostedSnippetCustomBundleFileSetup.md](/.github/docs/HostedSnippetCustomBundleFileSetup.md) for a full setup walkthrough

Integrate a fully customized the chat interface UI in the pre-built Hosted Widget, with all configurations available in the Connect Admin Console. The hosted widget can handle all of the logic to render the widget on your website and start chat sessions.

Host your own `amazon-connect-chat-interface.js` bundle file and provide the link in the widget snippet configuration. 

```diff
<!-- EXAMPLE SNIPPET -->

<script type="text/javascript">
  (function(w, d, x, id){s=d.createElement('script');s.src='https://d2s9x5slbvr0vu.cloudfront.net/amazon-connect-chat-interface-client.js';s.async=1;s.id=id;d.getElementsByTagName('head')[0].appendChild(s);w[x]=w[x]||function(){(w[x].ac=w[x].ac||[]).push(arguments)}})(window, document, 'amazon_connect', '360f3075-92ac-4648-adfe-84ee860c3bfd');
  
  amazon_connect('styles', { openChat: { color: '#ffffff', backgroundColor: '#07b62a'}, closeChat: { color: '#ffffff', backgroundColor: '#07b62a'} });
  amazon_connect('snippetId', 'QVFJREFIsadfsadfasdf');
  amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
+ amazon_connect('customerChatInterfaceUrl', 'https://...'); // TODO: put in your link to amazon-connect-chat-interface.js
+ // Local file is also supported: './amazon-connect-chat-interface.js'
</script>
```

![Custom Widget Experience](/.github/screenshots/fully-customize-widget-experience.png)

### Option 3: Hosted widget UI with custom Start Chat API

To get help setting up your own start chat backend and calling your own backend to start the chat contact instead of the Amazon-hosted backend, follow the instructions in the [startChatContactAPI](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI) section of the Git repository README to create an API to call the StartChatContact API. Once the API is created, you can call it in the CustomStartChat callback function and send the response back in the widget script.

```diff
<script type="text/javascript">
    (function(w, d, x, id){s=d.createElement('script');s.src='https://${apiId}.cloudfront.net/amazon-connect-chat-interface-client.js';s.async=1;s.id=id;d.getElementsByTagName('head')[0].appendChild(s);w[x]=w[x]||function(){(w[x].ac=w[x].ac||[]).push(arguments)}})(window, document, 'amazon_connect', '360f3075-asfd-asfd-asdf-asdf');

    amazon_connect('styles', { openChat: { color: '#ffffff', backgroundColor: '#07b62a'}, closeChat: { color: '#ffffff', backgroundColor: '#07b62a'} });
    amazon_connect('snippetId', 'replace_with_snippetId');
    amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
    ....
+   amazon_connect('customStartChat', async function(callback) {
+         window.fetch('https://replace_with_your_StartChatContact_api_url', {
+            method: "POST",
+            body: JSON.stringify({
+                ConnectInstanceId: "replace_with_testing_instanceId",
+                ContactFlowId: "replace_with_testing_contactflowid",
+                ParticipantDetails: {
+                    DisplayName: "replace_with_testing_displayname",
+                },
+                SupportedMessagingContentTypes: ["text/plain", "text/markdown"],
+                // Note: Since this request goes to your backend, you can customize the payload structure.
+                // The above parameters are examples only - you can modify what information is sent from
+                // the client and handle the actual StartChatContact API parameters on your backend.
+                // add the paramters depends on use case, check StartChatContact API documentation for more details on parameters
+                ....
+            }),
+        }).then((res) => {
+            // 'res' is the raw response object from fetch API
+            // We need to parse the response body using res.json()
+            // to convert it from raw response to JSON format
+            return res.json();
+        }).then(data => {
+            // Example of possible API Response structure:
+            // {
+            //    data: {
+            //      startChatResult: {
+            //          ContactId: string,           // Unique identifier for the chat contact
+            //          ParticipantId: string,      // Unique identifier for the participant
+            //          ParticipantToken: string,   // Authentication token for the chat session
+            //      }
+            //      ...
+            //    }
+            // }
+
+            console.log('data.data:', data.data)
+
+            // Note: The response from the fetch() may have a different structure than shown
+            // above (i.e., may not have data.data wrapper). It depends upon the user's
+            // API response structure, so users need to modify the data extraction accordingly
+
+            // The callback MUST receive data in this structure:
+            // {
+            //     startChatResult: {
+            //         ContactId: string,           // Unique identifier for the chat contact
+            //         ParticipantId: string,      // Unique identifier for the participant
+            //         ParticipantToken: string,   // Authentication token for the chat session
+            //     }
+            // }
+
+            // Pass the extracted data to callback
+            callback(data.data);
+        }).catch(error => {
+            // Handle errors from either the fetch operation
+            // or JSON parsing process
+            console.error('Fetch error:', error);
+        });
+    });
</script>
```

### Option 4: Customized Widget and Chat Interface UI (Self-Hosted)

> ❗ IMPORTANT: follow steps listed in [CustomChatAndWidgetSelfHostedSetup.md](/.github/docs/CustomChatAndWidgetSelfHostedSetup.md) for a full setup walkthrough

Fully customize the chat interface UI for your website, add a form to collect user info, and customize how the widget is rendered. Host and manage the bundle file yourself, importing it with a `<script src="amazon-connect-chat-interface.js"></script>` tag. Also refer to the [Custom Chat Widget Example](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/customChatWidget) code.

![Custom Widget Experience](/.github/screenshots/fully-customize-widget-experience.png)

Importing the bundle file into your project allows you to invoke the global connect methods after placing a `ChatInterface` object on the window. To initiate the chat, you can invoke `initiateChat()` and pass in some details about your Connect instance and the requesting user.

```html
<html>
    <head>
        <title>Amazon Connect Chat Interface Local Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script src="amazon-connect-chat-interface.js"></script>
    </head>
    <body>
        <div>
            <h1>Amazon Connect - Custom Implementation of Customer Chat</h1>
            <button id="startChatBtn">Launch Chat</button>
            <section class="section-chat" id="section-chat" style="float: right; width: 50%;">
                <div id="root"></div>
            </section>
        </div>
        <script>
            // CONFIGURATION
            var rootElemId = 'root'; // This is the id of the container where you want the widget to reside
            var customerName = 'Satoshi'; // can also be submitted in a form
            
            // BACKEND ENDPOINTS
            var apiGatewayEndpoint = `https://asdfasdf.execute-api.us-west-2.amazonaws.com/Prod/`; // REPLACE ME
            var region = 'us-west-2' // REPLACE ME
            var contactFlowId = '7d67abd3-06ae-4170-9d3b-7b5031caf208'; // REPLACE ME
            var instanceId = '3203af10-3e0d-4d59-9452-6543250cf7f6'; // REPLACE ME
            
            (function () {
              // Initialize the chat widget
              connect.ChatInterface.init({
                containerId: rootElemId // This is the id of the container where you want the widget to reside
              });
            
              document.getElementById('startChatBtn').addEventListener('click', function (e) {
                e.preventDefault();
            
                // Launch a chat
                connect.ChatInterface.initiateChat({
                  name: customerName,
                  region,
                  apiGatewayEndpoint,
                  contactFlowId,
                  instanceId,
                  contactAttributes: JSON.stringify({
                    "customerName": customerName
                  }),
                  featurePermissions: {
                    "ATTACHMENTS": false,  // this is the override flag from user for attachments
                  },
                  supportedMessagingContentTypes: "text/plain,text/markdown", // enable rich messaging
                }, successHandler, failureHandler);
              });
            })();
            
            function successHandler(chatSession) {
              console.log("success!");
            }
            
            function failureHandler(error) {
              console.log("There was an error: ");
              console.log(error);
            }
        </script>
    </body>
</html>
```

**NOTE:** This approach requires a proxy to invoke the Amazon Connect Public [StartChatContact](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) API. Refer to the [startChatContactAPI CloudFormation Template](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI) to deploy an API Gateway proxy solution.

![Custom Widget Experience Backend](/.github/screenshots/StartChatContactCFNTemplateArchitecture.png)

## Local Development

Fork the source code and generate a custom `amazon-connect-chat-interface.js` bundle file.

### Downloading AmazonConnectChatInterface from Github

Clone the public repository with the following command:

```
$ git clone https://github.com/amazon-connect/amazon-connect-chat-interface.git
$ cd amazon-connect-chat-interface
$ npm install
$ npm run release
```

### Development Build

To make local modifications to this package and test them on your webpage, simply make your edits and run `npm install && npm run dev-build` to produce the
Webpack built file and the sourcemaps. This generates the `amazon-connect-chat-interface.js` bundle file, which can be imported in `local-testing/index.html`.

> Optionally, run `npm run dev-watch` to auto-rebuild the bundle file during development.

To test changes on a local machine, refer to the steps listed in the [local-testing](local-testing/) folder.

### Production Build

To build the production version of this package, simply run `npm install && npm run build`. These will generate a minified built file, with console logs stripped and other Webpack optimizations.

## Specifications

 - Supported Browsers: refer to [Admin Guide Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/connect-supported-browsers.html)
 - NodeJS: `NodeJS LTS v16.x` (for local development) [see [CI worklow](https://github.com/amazon-connect/amazon-connect-chat-interface/actions/workflows/node.js.yml)]
 - Webpack: `webpack@v4`
 - React: `react@16`

## References

- [StartChatConact Proxy API Template](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI)
- [Custom Widget Example Code](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/customChatWidget)
- [Amazon Connect Open Source Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/download-chat-example.html)
- [Amazon Connect Chat Experience Admin Guide](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html)
- [ChatJS Source Code](https://github.com/amazon-connect/amazon-connect-chatjs)

### Web Accessibility Standards

This example repository aims to follow web accessibility standards, but does not guarantee a specific level of WCAG compliance (e.g. WCAG 2.0 AA). Team currently has internal accessibility auditing for the Amazon Connect OOTB Hosted Widget [[Learn More](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html)].

## Troubleshooting and Support

Review the resources given in the README and use our [documentation](./DOCUMENTATION.md) for guidance on how to develop on this library. Additionally, search our [issues database](https://github.com/amazon-connect/amazon-connect-chat-interface/issues) to see if your issue is already addressed. If not please cut us an [issue](https://github.com/amazon-connect/amazon-connect-chat-interface/issues/new/choose) using the provided templates.

If you have more questions, or require support for your business, you can reach out to [AWS Customer support](https://aws.amazon.com/contact-us). You can review our support plans [here](https://aws.amazon.com/premiumsupport/plans/?nc=sn&loc=1).

# Amazon Connect Chat UI Examples

There are additional examples on how to implement the customer side of Amazon Connect chat within our [ui examples repo](https://github.com/amazon-connect/amazon-connect-chat-ui-examples). Please refer to the README under each solution to see the complete details as to what each solution does and how to deploy it.

## Solutions

At the moment, these are the solutions in the github UI examples repo:

1. **[cloudformationTemplates/startChatContactAPI](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI)**
   The Start Chat Contact API solution creates a simple API to start the chat from the customer side. Use this solution if you want to custom build your customer chat widget. There is also an example html file in this repo that shows you how to make subsequent calls to Chat JS to send messages between the customer and agent after the chat is started.
2. **[cloudformationTemplates/urlPreviewForAsyncChat](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/urlPreviewForAsyncChat)**
   The Url preview for async chat solution is an enhancement of the Async Customer Chat solution, which presents URL previews in chat. For example, entering `www.aws.com` in the chat window will display a rich preview with an image of the website for a better experience. There is also an example html file in this repo that shows you how to make subsequent calls to Chat JS to send messages between the customer and agent after the chat is started.
3. **[samTemplates/amazon-connect-interactive-messages-example](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/samTemplates/amazon-connect-interactive-messages-example)**
   Interactive messages in Amazon Connect Chat allow contact centers to provide personalized prompts and response options that customers can easily select from. This serverless application is a sample lambda function which implements Amazon Connect interactive message templates (lists, lists with images, and a time picker) as described in the AWS Contact Center blog post [How to enable interactive messages in Amazon Connect chat](https://aws.amazon.com/blogs/contact-center/easily-set-up-interactive-messages-for-your-amazon-connect-chatbot/).

4. **[customChatWidget](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/customChatWidget)**
   Custom Chat Widget for Amazon Connect, with a Chat Form that can be easily plugged into a webpage. This solution helps customers to have Amazon Connect Custom Chat Widget in their website, by applying simple configuration parameters. It also makes customizing the `amazon-connect-interface.js` file easier, and can be used as an easy way to host custom widget on a webpage.

5. **[connectReactNativeChat](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/mobileChatExamples/connectReactNativeChat)**
   React Native demo Chat application for Amazon Connect. This cross-platform solution implements basic Chat JS functionality and is fully customizable. Follow the provided documentation to build with [`amazon-connect-chatjs@^1.5.0`](https://github.com/amazon-connect/amazon-connect-chatjs).
   
6. **[startChatContactAPILocalProxy](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/startChatContactAPILocalProxy)**
   Solution to run local proxy server for the Amazon Connect [StartChatContact](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html) Public API. Can be used during local development when building a custom chat interface, prior to deploying a production CloudFormation chat backend.

6. **[hostedWidgetCustomization](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/hostedWidgetCustomization)**
   Additional ways to configure the Amazon Connect Hosted Widget on your website and further personalize the branding. This sample code covers several common use cases for customizing the widget snippet code. [Learn more](https://docs.aws.amazon.com/connect/latest/adminguide/add-chat-to-website.html)

7. **[mobileChatExamples](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/mobileChatExamples)**
   These native mobile examples of the AWS Connect chat widget are designed for easy integration with a focus on customization. Out-of-the-box ready yet fully adaptable, they offer developers the perfect starting point for incorporating a chat feature that can be fine-tuned to any customer’s requirements.


## Resources

Here are a few resources to help you implement chat in your contact center:

- [Amazon Connect ChatJS](https://github.com/amazon-connect/amazon-connect-chatjs)
- [Amazon Connect Streams](https://github.com/aws/amazon-connect-streams)
- [Amazon Connect Service SDK](https://docs.aws.amazon.com/connect/latest/APIReference/Welcome.html) (Download the SDK [here](https://github.com/aws/))
- [Amazon Connect Participant Service SDK](https://docs.aws.amazon.com/connect-participant/latest/APIReference/Welcome.html) (Download the SDK [here](https://github.com/aws/))
- [iOS Mobile SDK](https://github.com/aws-amplify/aws-sdk-ios)
  - [Amazon Connect Participant Service](https://cocoapods.org/pods/AWSConnectParticipant)
  - [Amazon Connect Service](https://cocoapods.org/pods/AWSConnect)
- [Android SDK](https://github.com/aws-amplify/aws-sdk-android)
- [Open source code for the Chat Interface](https://github.com/amazon-connect/amazon-connect-chat-interface)

## License

This project is made available under the MIT-0 license. See the LICENSE file.

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
