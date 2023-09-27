import { ChatEvents } from './ChatEvents';
import EventBus from './eventbus';

describe('ChatEvents', () => {
  let myChatEvent = new ChatEvents();
  let myFn;
  beforeEach(() => {
    myFn = jest.fn();
  });

  afterEach(() => {
    expect(myFn).toBeCalled();
  });

  test('escalateToVoice event', () => {
    myChatEvent.onVoiceEscalation(myFn);
    EventBus.trigger('escalateToVoice', {});
  });

  test('agentEndChat event', () => {
    myChatEvent.onAgentEndChat(myFn);
    EventBus.trigger('agentEndChat', {});
  });

  test('endChat event', () => {
    myChatEvent.onChatEnded(myFn);
    EventBus.trigger('endChat', {});
  });

  test('loadChat event', () => {
    myChatEvent.onChatLoading(myFn);
    EventBus.trigger('loadChat', {});
  });

  test('startNewChat event', () => {
    myChatEvent.onStartNewChat(myFn);
    EventBus.trigger('startNewChat', {});
  });

  test('pushNotificationEligibleMessageReceived event', () => {
    myChatEvent.onPushNotificationEligibleMessageReceived(myFn);
    EventBus.trigger('pushNotificationEligibleMessageReceived', {});
  });
});