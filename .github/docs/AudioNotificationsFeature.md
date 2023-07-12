# Audio Notifications

A commonly requested feature for the Connect Chat Interface is to play a sound when a new message is received from the agent. This can be done via the [ChatJS](https://github.com/amazon-connect/amazon-connect-chatjs#chatsessiononmessage) `onMessage` event.

An implementation might look like the following, in the constructor of `ChatSession.js` (although you can set this up anywhere you have access to the ChatJS `chatSession` object):
```js
const audioObj = new Audio('my-notification-sound.mp3');

this.session.onMessage(event => {
  const { chatDetails, data } = event;
  if (data.ParticipantRole === "AGENT") {
    audioObj.play();
  }
});
```

Note that for larger audio files you may need to more gracefully handle when the audio is actually available to play: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio#determining_when_playback_can_begin.
