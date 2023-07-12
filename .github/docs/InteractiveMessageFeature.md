# Interactive Messages

Rich messages that present a prompt and pre-configured display options for a customer to choose. These messages are powered by Amazon Lex and configured through Amazon Lex using a Lambda. [Learn more](https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html)

<img width="450px" alt="Amazon Connect Interactive Messages" src="/.github/screenshots/interactive-messages-mocks.png">

<img width="450px" alt="Amazon Connect Interactive Messages Diagram" src="/.github/screenshots/interactive-message-diagram.png">

## Reference

 - Initial release date: 11/24/2020
 - Admin Guide: ["Add interactive messages to chat"](https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html)
 - [Launch Announcement](https://aws.amazon.com/about-aws/whats-new/2020/11/amazon-connect-chat-supports-interactive-messages/)
 - [Launch Announcement #2](https://aws.amazon.com/about-aws/whats-new/2023/06/amazon-connect-chat-quick-reply-carousel-messages/)

## Architecture

![](/.github/screenshots/AmazonConnectLexLambdaArchitecture.png)

## Implementation Resources

 - Official Docs: [Interactive Message Documentation](https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html)
 - AWS Blog Post: ["Easily set up interactive messages for your Amazon Connect chatbot"](https://aws.amazon.com/blogs/contact-center/easily-set-up-interactive-messages-for-your-amazon-connect-chatbot/)
 - Template Lex Lambda: [amazon-connect-interactive-messages-example](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/samTemplates/amazon-connect-interactive-messages-example)
 - Workshop: ["Enhance your Amazon Connect Contact Center with Amazon Lex"](https://catalog.us-east-1.prod.workshops.aws/workshops/638d00f5-2248-488f-b7ca-903e8b966bf8/en-US)

## Features

### Markdown formatting<a name="markdown-formatting"></a>

Markdown text formatting is supported in template title/subtitle fields. Our implementation includes syntax found in the example below, which can be reviewed [here](https://commonmark.org/help/).

<img src="/.github/screenshots/interactive-markdown-formatting.png" width="350px" alt="Interactive Message Rich Formatting" />

```md
This is some *emphasized text* and some **strongly emphasized text**

This is a bulleted list:
* item 1
* item 2
* item 3

This is a numbered list:
1. item 1
2. item 2
3. item 3

Questions? Visit https://plainlink.com/faq

[This is a link](https://aws.amazon.com)

This is `<code />`
```

```json
{
    "templateType": "ListPicker",
    "version": "1.0",
    "data": {
        "content": {
            "title": "How can we help? [aws.amazon.com](https://aws.amazon.com)<!--rehype:target=_self-->",
            "subtitle": "This is some *emphasized text* and some **strongly emphasized text**\r\nThis is a bulleted list:\n* item 1\n* item 2\n* item 3\n\nThis is a numbered list:\n1. item 1\n2. item 2\n3. item 3\n\nQuestions? Visit https://plainlink.com/faq\r\n[This is a link](https://aws.amazon.com)\r\nThis is `<code />`",
            "elements": [
                {
                    "title": "Check self-service options"
                },
                {
                    "title": "Talk to an agent"
                },
                {
                    "title": "End chat"
                }
            ]
        }
    }
}
```

Title/subtitle strings can be written with multi-line format, or single line with `\r\n` line break characters.

```js
const PickerSubtitle = `This is some *emphasized text* and some **strongly emphasized text**

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

This is \`<code />\`
`
const SingleLinePickerSubtitle = "This is some *emphasized text* and some **strongly emphasized text**\r\nThis is a bulleted list:\n* item 1\n* item 2\n* item 3\n\nThis is a numbered list:\n1. item 1\n2. item 2\n3. item 3\n\nQuestions? Visit https://plainlink.com/faq\r\n[This is a link](https://aws.amazon.com)\r\nThis is `<code />`";

const ListPicker = {
    templateType: "ListPicker",
    version: "1.0",
    data: {
        content: {
            title: "How can we help? [aws.amazon.com](https://aws.amazon.com)<!--rehype:target=_self-->",
            subtitle: PickerSubtitle || SingleLinePickerSubtitle,
            elements: [ /* ... */ ]
        }
    }
}
```

#### Markdown Links

To create a link, use the following syntax:

```
[aws](https://aws.amazon.com)
```

You can also set the link's target attribute using rehype syntax (default is `target="_blank"`):

```
[plain text](https://example.com)<!--rehype:target=_self-->
```

### Pagination logic for ListPicker options

Please refer to [`InteractiveMessageActionButtonImplementation.md`](/.github/docs/InteractiveMessageActionButtonImplementation.md)

Currently the max number of list picker options that return from server(via Lex) is 6(10 for panel picker), but our customers would like to provide more options to their end customers. In order to achieve this goal, we have implemented the idea of "Show more" and "Previous options" buttons in our interactive message UI. These changes will require customers to provide some new data when they configure the interactive message so that they are able to use this new feature. [Learn more about setting up action buttons](/.github/docs/InteractiveMessageActionButtonImplementation.md)

<img src="/.github/screenshots/interactive-message-action-buttons.png" width="200px" alt="InteractiveMessageActionButtonScreenshot" />

## Example Templates

Here is an example of a `List Picker` template:

```json
{
    "templateType":"ListPicker",
    "version":"1.0",
    "data":{
        "content":{
            "title":"Which department do you want to select?",
            "subtitle":"Tap to select option",
            "imageType":"URL",
            "imageData":"https://amazon-connect-interactive-message-blog-assets.s3-us-west-2.amazonaws.com/interactive-images/company.jpg",
            "elements":[
                {
                    "title":"Billing",
                    "subtitle":"Request billing information",
                    "imageType":"URL",
                    "imageData":"https://amazon-connect-interactive-message-blog-assets.s3-us-west-2.amazonaws.com/interactive-images/billing.jpg"
                },
                {
                    "title":"New Service",
                    "subtitle":"Set up a new service",
                    "imageType":"URL",
                    "imageData":"https://amazon-connect-interactive-message-blog-assets.s3-us-west-2.amazonaws.com/interactive-images/new_service.jpg"
                },
                {
                    "title":"Cancellation",
                    "subtitle":"Request a cancellation",
                    "imageType":"URL",
                    "imageData":"https://amazon-connect-interactive-message-blog-assets.s3-us-west-2.amazonaws.com/interactive-images/cancel.jpg"
                }
            ]
        }
    }
}
``` 
Here is an example of a `Time Picker` template:

```json
{
    "templateType":"TimePicker",
    "version":"1.0",
    "data":{
        "content":{
            "title":"Schedule appointment",
            "subtitle":"Tap to select option",
            "timeslots":[
                {
                    "date":"2020-10-31T18:00+00:00",
                    "duration":60
                },
                {
                    "date":"2020-10-15T13:00+00:00",
                    "duration":60
                },
                {
                    "date":"2020-10-15T16:00+00:00",
                    "duration":60
                }
            ]
        }
    }
}
```

Here is an example of a `Panel` template:

```json
{
  "templateType": "Panel",
  "version": "1.0",
  "data": {
    "content": {
      "title": "How can I help you?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData":
        "https://amazon-connect-interactive-message-blog-assets.s3-us-west-2.amazonaws.com/interactive-images/company.jpg",
      "elements": [
        {
          "title": "Check self-service options",
        },
        {
          "title": "Talk to an Agent",
        },
        {
          "title": "End chat",
        },
      ],
    },
  },
}
```

Here is an example of a `Time Picker` template:

```json
{
  "templateType": "Panel",
  "version": "1.0",
  "data": {
    "content": {
      "title": "How can I help you?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData":
        "https://amazon-connect-interactive-message-blog-assets.s3-us-west-2.amazonaws.com/interactive-images/company.jpg",
      "elements": [
        {
          "title": "Check self-service options",
        },
        {
          "title": "Talk to an Agent",
        },
        {
          "title": "End chat",
        },
      ],
    },
  },
}
```

Here is an example of a `QuickReply` template:

```json
{
  "templateType": "QuickReply",
  "version": "1.0",
  "data": {
      "content": {
        "title": "How was your experience?",
        "elements": [
            {
                "title": "Lorem ipsum"
            },
            {
                "title": "Lorem ipsum"
            },
            {
                "title": "Lorem ipsum dolor sit amet"
            },
            {
                "title": "Ipsum"
            }
        ]
      }
  }
}
```

Here is an example of a `Carousel` template:

```json
{
  "templateType": "Carousel",
  "version": "1.0",
  "data": {
    "content": {
      "title": "Select a destination:",
      "elements": [
        {
          "templateType": "ListPicker",
          "templateIdentifier": "8c0a55c8-1c37-41c2-b22a-62b2aaa7f1ac",
          "version": "1.0",
          "data": {
            "content": {
              "title": "Explore our travel options:",
              "subtitle": "Select an option:",
              "imageType": "URL",
              "imageData":
                "https://www.usnews.com/object/image/00000173-fe24-d76b-a773-fe3679d20000/200817-planesky-stock.jpg?update-time=1597696716591&size=responsive640",
              "elements": [
                {
                  "title": "Purchase Ticket",
                },
                {
                  "title": "View All Destinations",
                },
                {
                  "title": "Learn More",
                  "type": "hyperlink",
                  "url": "https://github.com/amazon-connect/amazon-connect-chat-interface",
                },
              ],
            },
          },
        },
        {
          "templateType": "ListPicker",
          "templateIdentifier": "2c0a55c8-3c37-41c2-b22a-62b2aaa7f1ac",
          "version": "1.0",
          "data": {
            "content": {
              "title": "Explore Hotel destinations",
              "subtitle": "Select an option:",
              "imageType": "URL",
              "imageData":
                "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/a1/9c/80/essentia-luxury-hotel.jpg?w=700&h=-1&s=1",
              "elements": [
                {
                  "title": "Book Room",
                },
                {
                  "title": "View All Listings",
                },
                {
                  "title": "Learn More",
                  "type": "hyperlink",
                  "url": "https://github.com/amazon-connect/amazon-connect-chat-interface",
                },
              ],
            },
          },
        },
        {
          "templateType": "ListPicker",
          "templateIdentifier": "3c0a55c8-3c37-41c2-b22a-62b2aaa7f1ac",
          "version": "1.0",
          "data": {
            "content": {
              "title": "Explore dining options",
              "subtitle": "Select an option:",
              "imageType": "URL",
              "imageData":
                "https://t3.ftcdn.net/jpg/02/27/62/24/360_F_227622470_sJ3yEaz44RK7UrWNaGdSn7azgeRu9UDs.jpg",
              "elements": [
                {
                  "title": "Book Table",
                },
                {
                  "title": "View Popular Entrees",
                },
                {
                  "title": "Learn More",
                  "type": "hyperlink",
                  "url": "https://github.com/amazon-connect/amazon-connect-chat-interface",
                },
              ],
            },
          },
        },
        {
          "templateType": "ListPicker",
          "templateIdentifier": "4c0a55c8-3c37-41c2-b22a-62b2aaa7f1ac",
          "version": "1.0",
          "data": {
            "content": {
              "title": "Explore our travel options:",
              "subtitle": "Select an option:",
              "imageType": "URL",
              "imageData":
                "https://media.istockphoto.com/photos/young-woman-pulling-suitcase-in-airport-terminal-copy-space-picture-id1173736603?b=1&k=20&m=1173736603&s=612x612&w=0&h=1V_XBSWHppXzMQIzkyG6drqgrEl_prEogWXjbN7Gxwo=",
              "elements": [
                {
                  "title": "Purchase Ticket",
                },
                {
                  "title": "View All Destinations",
                },
                {
                  "title": "Learn More",
                  "type": "hyperlink",
                  "url": "https://github.com/amazon-connect/amazon-connect-chat-interface",
                },
              ],
            },
          },
        },
        {
          "templateType": "ListPicker",
          "templateIdentifier": "6c0a55c8-3c37-41c2-b22a-62b2aaa7f1ac",
          "version": "1.0",
          "data": {
            "content": {
              "title": "Hotel Gabonzo Suite",
              "subtitle": "Select an option:",
              "imageType": "URL",
              "imageData":
                "https://media.istockphoto.com/id/929135598/photo/santorini-greece-picturesq-view-of-traditional-cycladic-santorini-houses-on-small-street-with.jpg?s=612x612&w=0&k=20&c=Z8R8IPtjYfk8gc5Q-1Q4jD1coUgqu5vuTezM2ONRUPA=",
              "elements": [
                {
                  "title": "Book Tour",
                },
                {
                  "title": "View Ratings",
                },
                {
                  "title": "Open Gallery",
                  "type": "hyperlink",
                  "url": "https://github.com/amazon-connect/amazon-connect-chat-interface",
                },
              ],
            },
          },
        },
      ],
    },
  },
}
```