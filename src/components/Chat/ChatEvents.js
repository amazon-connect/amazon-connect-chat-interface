/**
 * Simple utitlity for Event subscription
 */
import EventBus from './eventbus';

export class ChatEvents {
  constructor() {
    EventBus.on('endChat', this.endChat.bind(this));
    EventBus.on('loadChat', this.loadChat.bind(this));
    EventBus.on('startNewChat', this.startNewChat.bind(this));
    EventBus.on(
      'pushNotificationEligibleMessageReceived',
      this.approvePushNotificationEligibleMessageReceived.bind(this),
    );
    EventBus.on('agentEndChat', this.agentEndChat.bind(this));
    EventBus.on('escalateToVoice', this.escalateToVoice.bind(this));
  }

  _eventHandlers = {
    'chat-disconnected': [],
    'chat-loading': [],
    'chat-start-new': [],
    'push-notification-eligible-message-received': [],
    'agent-end-chat': [],
    'voice-escalation': [],
  };

  onVoiceEscalation(callback) {
    this.on('voice-escalation', function (...rest) {
      callback(...rest);
    });
  }

  onChatEnded(callback) {
    this.on('chat-disconnected', function (...rest) {
      callback(...rest);
    });
  }

  onStartNewChat(callback) {
    this.on('chat-start-new', function (...rest) {
      callback(...rest);
    });
  }

  onChatLoading(callback) {
    this.on('chat-loading', function (...rest) {
      callback(...rest);
    });
  }
  onPushNotificationEligibleMessageReceived(callback) {
    this.on('push-notification-eligible-message-received', function (...rest) {
      callback(...rest);
    });
  }

  onAgentEndChat(callback) {
    this.on('agent-end-chat', function (...rest) {
      callback(...rest);
    });
  }

  on(eventType, handler) {
    if (this._eventHandlers[eventType].indexOf(handler) === -1) {
      this._eventHandlers[eventType].push(handler);
    }
  }

  _triggerEvent(eventType, payload) {
    this._eventHandlers[eventType].forEach((handler) => {
      handler(payload);
    });
  }

  escalateToVoice(chatContactId) {
    this._triggerEvent('voice-escalation', chatContactId);
  }

  endChat() {
    this._triggerEvent('chat-disconnected');
  }

  loadChat() {
    this._triggerEvent('chat-loading');
  }

  startNewChat() {
    this._triggerEvent('chat-start-new');
  }
  approvePushNotificationEligibleMessageReceived() {
    this._triggerEvent('push-notification-eligible-message-received');
  }
  agentEndChat() {
    this._triggerEvent('agent-end-chat');
  }
}

window.connect = window.connect || {};
window.connect.ChatEvents = window.connect.ChatEvents || new ChatEvents();