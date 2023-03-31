# Implementation of action buttons in interactive message list picker/panel

## Table of content
  - [Context](#context)
  - [Configuration and new fields explanation:](#configuration-and-new-fields-explanation)
    - [Update for StartChatContact request](#update-for-startchatcontact-request)
    - [Required fields](#required-fields)
  - [Lambda response template](#lambda-response-template)
  - [Operation flow](#operation-flow)

## Context

Currently the max number of list picker options that return from server(via Lex) is 6(10 for panel picker), but our customers would like to provide more options to their end customers.
In order to achieve this goal, we have implemented the idea of "Show more" and "Previous options" buttons in our interactive message UI. These changes will require customers to provide some new data when they configure the interactive message so that they are able to use this new feature.

## Configuration and new fields explanation:

*Note: `action button` is referred to the buttons with functionality of `Show more` or `Previous options` because any text can be used as their titles.*

### Update for StartChatContact request

In order to use this new feature, you need to have your StartChatContact API request body update. You need to add a new content type: `application/vnd.amazonaws.connect.message.interactive.response` to `SupportedMessagingContentTypes`. For example:

```
PUT /contact/chat HTTP/1.1
Content-type: application/json
{
   "Attributes": { 
      "string" : "string" 
   },
   "ChatDurationInMinutes": number,
   "ClientToken": "string",
   "ContactFlowId": "string",
   "InitialMessage": { 
      "Content": "string",
      "ContentType": "string"
   },
   "InstanceId": "string",
   "ParticipantDetails": { 
      "DisplayName": "string"
   },
   "PersistentChat": { 
      "RehydrationType": "string",
      "SourceContactId": "string"
   },
   "RelatedContactId": "string",
   "SupportedMessagingContentTypes": [ "application/vnd.amazonaws.connect.message.interactive.response" ] <--- Add contentType here
}
```

StartChatContact API [Documentation](https://docs.aws.amazon.com/connect/latest/APIReference/API_StartChatContact.html)

New contentType `application/vnd.amazonaws.connect.message.interactive.response` [documentation](https://docs.aws.amazon.com/connect/latest/APIReference/API_ChatMessage.html)

### Required fields

All of these new fields are **required** if you want to implement action buttons in interactive message.

* **`listId`**: string. It is used for getting the data source of list picker in server side. Adding this because it is possible to have multiple data sources for list picker.
* **`referenceId`**: string. It is generated when a new interactive message is generated from server. `referenceId` is used in our UI to find the same interactive message session so that we can replace the old message with the new one. For example, when user click action button, `referenceId` is added to request body, and sent to server. A new interactive message is created with this `referenceId`, and return from server. We need to find the most recent interactive message from the same session based on `referenceId`, and replace the old message with the new one.
* **`preIndex`**: number. This field is used in server side to get the previous list of options. When user click action button to load previous options, `preIndex` is sent to server, a new list of options can be generated from the data source list, starting from index `preIndex`. You can use `preIndex` and `nextIndex` to implement your pagination algorithm. Check the [Operation flow](#operation-flow) section below to understand more.
* **`nextIndex`**: number. This field is used in server side to get the next list of options. When user click `show more` button, `nextIndex` is sent to server, a new list of options can be generated from the data source list, starting from index `nextIndex`. You can use `preIndex` and `nextIndex` to implement your pagination algorithm. Check the [Operation flow](#operation-flow) section below to understand more.
* **`actionDetail`:** `PREVIOUS_OPTIONS` or `SHOW_MORE` only. Action buttons should be the options in the `elements` list. There are only two fields are required for action buttons: `title` and `actionDetail`. The value of `actionDetail` can be `PREVIOUS_OPTIONS` or `SHOW_MORE` only. It is used for recognizing the action of this button. Check the [Operation flow](#operation-flow) section below to understand more.

## Lambda response template

The template below can be used in lambda code. 

[Interactive message documentation](https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html)

New fields are marked below. All new fields are required if you want to use this new feature.

```
{
  "templateType": "ListPicker", // required, must be "ListPicker"
  "version": "1.0", // required, must be "1.0"
  "data": {
    "content": {
      "title": "What produce would you like to buy?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData": "Your image URL",
      "referenceId": "320435df-2e3c-47ea-9206-e64f81dd8e3c", // New field
      "listId": "serviceList", // New field
      "preIndex": 4, // New field
      "nextIndex": 9 // New field
      "elements": [
        {
          "title": "Previous options",
          "actionDetail": "PREVIOUS_OPTIONS" // New field
        },
        {
          "title": "Audiologist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Podiatrist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Osteopath",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Christian science practitioner",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Show more",
          "actionDetail": "SHOW_MORE"
        }
      ],
    }
  }
}
```

## Operation flow

This section will explain what data will be sent/received to/from server.

1. Start a new chat, type some text which can trigger interactive message(e.g. `LIST PICKER`) and then send the message. API `sendMessage` is called, with request body:

```
{
   "Content":"LIST PICKER",
   "ContentType":"text/plain",
   "ClientToken":"fa5474a0-52bf-4cb5-bc94-f491f620af04"
}
```

2. Receive interactive message data from web socket:

```
{
   "content":"{\"AbsoluteTime\":\"2023-03-21T06:33:01.515Z\",\"Content\":\"{\\\"templateType\\\":\\\"ListPicker\\\",\\\"version\\\":\\\"1.0\\\",\\\"data\\\":{\\\"content\\\":{\\\"listId\\\":\\\"serviceList\\\",\\\"title\\\":\\\"What produce would you like to buy?\\\",\\\"subtitle\\\":\\\"Tap to select option\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\",\\\"referenceId\\\":\\\"320435df-2e3c-47ea-9206-e64f81dd8e3c\\\",\\\"elements\\\":[{\\\"title\\\":\\\"Massage therapist\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Physiotherapy\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Acupuncture\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Chiropractor\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Naturopath\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Show more\\\",\\\"actionDetail\\\":\\\"SHOW_MORE\\\"}],\\\"preIndex\\\":-1,\\\"nextIndex\\\":5}}}\",\"ContentType\":\"application/vnd.amazonaws.connect.message.interactive\",\"Id\":\"d2ee0b6e-6b61-498e-a6e7-14356365b0b3\",\"Type\":\"MESSAGE\",\"ParticipantId\":\"1c2142ab-89b0-4a27-9f9f-e32b84e7cfc3\",\"DisplayName\":\"BOT\",\"ParticipantRole\":\"SYSTEM\",\"InitialContactId\":\"a307b665-fe6a-47c0-94c9-e1238918ba14\",\"ContactId\":\"a307b665-fe6a-47c0-94c9-e1238918ba14\"}",
   "contentType":"application/json",
   "topic":"aws/chat"
}
```

3. Formatted `content.Content` from 2nd step:

```
{
  "templateType": "ListPicker",
  "version": "1.0",
  "data": {
    "content": {
      "listId": "serviceList",
      "title": "What produce would you like to buy?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData": "Your image URL",
      "referenceId": "320435df-2e3c-47ea-9206-e64f81dd8e3c",
      "elements": [
        {
          "title": "Massage therapist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Physiotherapy",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Acupuncture",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Chiropractor",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Naturopath",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Show more",
          "actionDetail": "SHOW_MORE"
        }
      ],
      "preIndex": -1,
      "nextIndex": 5
    }
  }
}
```

Some notes about the new fields:
* `listId` : Any strings can be used as its value. Here use `serviceList` just for understanding easily.
* `referenceId` : initialized in the first request when the interactive message session is started. Once it is initialized, it will be used through out the whole interactive messages session. When user send a new trigger messsage to start a new interactive message, a new `referenceId` also be generated.
* Because this is the first interactive message, so in `data.content.elements`, only contains `SHOW_MORE`.
* `preIndex` is `-1` because there is no option of `PREVIOUS_OPTIONS` currently.
* `nextIndex` is `5`, this means when user click `SHOW_MORE`, the next list of options will be selected from index 5 in ascending order. **Reason**: the max length of `elements` is 6, and `SHOW_MORE` is the last element in `elements`, the first 5 elements in the data source are selected and presented in `elements`, so the new list will start from index 5.
* `actionDetail` : action buttons only required 2 fields: `title` and `actionDetail`. The value of `actionDetail` should be `SHOW_MORE` or `PREVIOUS_OPTIONS` only.

4. Click `Show more` button, the request body of `sendMessage` API:

```
{
   "Content":"{\"version\":\"1.0\",\"data\":{\"actionName\":\"SHOW_MORE\",\"preIndex\":-1,\"nextIndex\":5,\"listId\":\"serviceList\",\"templateType\":\"ListPicker\",\"referenceId\":\"320435df-2e3c-47ea-9206-e64f81dd8e3c\"},\"action\":\"SHOW_MORE\"}",
   "ContentType":"application/vnd.amazonaws.connect.message.interactive.response",
   "ClientToken":"dcd7211e-9637-40b1-8f73-3c9f863cbdac"
}
```

5. Formatted `Content` :

```
{
  "version": "1.0",
  "data": {
    "actionName": "SHOW_MORE",
    "preIndex": -1,
    "nextIndex": 5,
    "listId": "serviceList",
    "templateType": "ListPicker",
    "referenceId": "320435df-2e3c-47ea-9206-e64f81dd8e3c"
  },
  "action": "SHOW_MORE"
}
```

6. Receive some new options from web socket:

```
{
   "content":"{\"AbsoluteTime\":\"2023-03-21T06:41:09.331Z\",\"Content\":\"{\\\"templateType\\\":\\\"ListPicker\\\",\\\"version\\\":\\\"1.0\\\",\\\"data\\\":{\\\"content\\\":{\\\"listId\\\":\\\"serviceList\\\",\\\"title\\\":\\\"What produce would you like to buy?\\\",\\\"subtitle\\\":\\\"Tap to select option\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\",\\\"referenceId\\\":\\\"320435df-2e3c-47ea-9206-e64f81dd8e3c\\\",\\\"elements\\\":[{\\\"title\\\":\\\"Previous options\\\",\\\"actionDetail\\\":\\\"PREVIOUS_OPTIONS\\\"},{\\\"title\\\":\\\"Audiologist\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Podiatrist\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Osteopath\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Christian science practitioner\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Show more\\\",\\\"actionDetail\\\":\\\"SHOW_MORE\\\"}],\\\"preIndex\\\":4,\\\"nextIndex\\\":9}}}\",\"ContentType\":\"application/vnd.amazonaws.connect.message.interactive\",\"Id\":\"6c77fc4a-155b-45e3-aab7-4480dd4bd314\",\"Type\":\"MESSAGE\",\"ParticipantId\":\"1c2142ab-89b0-4a27-9f9f-e32b84e7cfc3\",\"DisplayName\":\"BOT\",\"ParticipantRole\":\"SYSTEM\",\"InitialContactId\":\"a307b665-fe6a-47c0-94c9-e1238918ba14\",\"ContactId\":\"a307b665-fe6a-47c0-94c9-e1238918ba14\"}",
   "contentType":"application/json",
   "topic":"aws/chat"
}
```

7. Formatted `content.Content`.

```
{
  "templateType": "ListPicker",
  "version": "1.0",
  "data": {
    "content": {
      "listId": "serviceList",
      "title": "What produce would you like to buy?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData": "Your image URL",
      "referenceId": "320435df-2e3c-47ea-9206-e64f81dd8e3c",
      "elements": [
        {
          "title": "Previous options",
          "actionDetail": "PREVIOUS_OPTIONS"
        },
        {
          "title": "Audiologist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Podiatrist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Osteopath",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Christian science practitioner",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Show more",
          "actionDetail": "SHOW_MORE"
        }
      ],
      "preIndex": 4,
      "nextIndex": 9
    }
  }
}
```
Some notes:
- `referenceId`: it is remaining the same value.
- `actionDetail`: `PREVIOUS_OPTIONS` is showing after clicking `SHOW_MORE`
- `preIndex`: it is updated from `-1` to `4`, this means if user click `PREVIOUS_OPTIONS`, the next list of options will be selected from index 4 in descending order.
- `nextIndex`: it is updated from `5` to `9`, this means if user click `SHOW_MORE`, the next list of options will be selected from index 9 in ascending order.

8. Click `Previous Options` button, the formatted `Content` field from request body:
```
{
  "version": "1.0",
  "data": {
    "actionName": "PREVIOUS_OPTIONS",
    "preIndex": 4,
    "nextIndex": 9,
    "listId": "serviceList",
    "templateType": "ListPicker",
    "referenceId": "320435df-2e3c-47ea-9206-e64f81dd8e3c"
  },
  "action": "PREVIOUS_OPTIONS"
}
```
9.  Previous options are return from server:

```
{
   "content":"{\"AbsoluteTime\":\"2023-03-21T07:07:54.519Z\",\"Content\":\"{\\\"templateType\\\":\\\"ListPicker\\\",\\\"version\\\":\\\"1.0\\\",\\\"data\\\":{\\\"content\\\":{\\\"listId\\\":\\\"serviceList\\\",\\\"title\\\":\\\"What produce would you like to buy?\\\",\\\"subtitle\\\":\\\"Tap to select option\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\",\\\"referenceId\\\":\\\"61c12e9e-bf87-4086-808d-5d81293ac368\\\",\\\"elements\\\":[{\\\"title\\\":\\\"Massage therapist\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Physiotherapy\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Acupuncture\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Chiropractor\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Naturopath\\\",\\\"subtitle\\\":\\\"$1.00\\\",\\\"imageType\\\":\\\"URL\\\",\\\"imageData\\\":\\\"Your image URL\\\"},{\\\"title\\\":\\\"Show more\\\",\\\"actionDetail\\\":\\\"SHOW_MORE\\\"}],\\\"preIndex\\\":-1,\\\"nextIndex\\\":5}}}\",\"ContentType\":\"application/vnd.amazonaws.connect.message.interactive\",\"Id\":\"933fa4b8-cbd0-4847-b91f-d6f39b8df804\",\"Type\":\"MESSAGE\",\"ParticipantId\":\"870c12ea-9f8e-4d33-9638-d7ede641039b\",\"DisplayName\":\"BOT\",\"ParticipantRole\":\"SYSTEM\",\"InitialContactId\":\"0ac6ce02-93f8-4804-9ed3-d5d4842504f6\",\"ContactId\":\"0ac6ce02-93f8-4804-9ed3-d5d4842504f6\"}",
   "contentType":"application/json",
   "topic":"aws/chat"
}
```

10. Formatted `content.Content`. 

```
{
  "templateType": "ListPicker",
  "version": "1.0",
  "data": {
    "content": {
      "listId": "serviceList",
      "title": "What produce would you like to buy?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData": "Your image URL",
      "referenceId": "320435df-2e3c-47ea-9206-e64f81dd8e3c",
      "elements": [
        {
          "title": "Massage therapist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Physiotherapy",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Acupuncture",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Chiropractor",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Naturopath",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Show more",
          "actionDetail": "SHOW_MORE"
        }
      ],
      "preIndex": -1,
      "nextIndex": 5
    }
  }
}
```
Some notes:

- `referenceId`: it is remaining the same value.
- `preIndex`: it is updated from `4` to `-1`
- `nextIndex`: it is updated from `9` to `5`

11. Click any option except action buttons, some information text will be return from server and the current interactive message session is ended. Then type the trigger text again(e.g. `LIST PICKER`) again and send it. In response, most of fields are the same with the previous example except `referenceId`:

```
{
  "templateType": "ListPicker",
  "version": "1.0",
  "data": {
    "content": {
      "listId": "serviceList",
      "title": "What produce would you like to buy?",
      "subtitle": "Tap to select option",
      "imageType": "URL",
      "imageData": "Your image URL",
      "referenceId": "d16fd46e-817e-4132-b313-544eb655916b",
      "elements": [
        {
          "title": "Massage therapist",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Physiotherapy",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Acupuncture",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Chiropractor",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Naturopath",
          "subtitle": "$1.00",
          "imageType": "URL",
          "imageData": "Your image URL"
        },
        {
          "title": "Show more",
          "actionDetail": "SHOW_MORE"
        }
      ],
      "preIndex": -1,
      "nextIndex": 5
    }
  }
}
```

