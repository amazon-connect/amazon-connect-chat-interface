// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Simple utitlity for for Event subscription
 */

class EventBus {

  constructor() {
    this._eventMap = new Map();
    if(window.connect && window.connect.LogManager) {
      this.logger = window.connect.LogManager.getLogger({ prefix: "ChatInterface-EventBus" });
    }
  }

  on(name, handler) {
    if (name && handler) {
      const eventHandlers = this._eventMap.get(name) || new Map();
      const handlerKey = generateHashKey(handler);
      eventHandlers.set(handlerKey, handler);
      this._eventMap.set(name, eventHandlers);
      this.logger && this.logger.info(`EventBus added event: [${name}].`);
    } else {
      this.logger && this.logger.error("For binding an event 'name' and 'handler' is mandatory", "provided parameters are", name, handler)
    }
  }

  off(name, handler) {
    if (!handler) {
      this._eventMap.delete(name);
      this.logger && this.logger.info(`EventBus cleared all event listeners: [${name}]`);
      return;
    }

    const handlers = this._eventMap.get(name);
    if (handlers) {
      handlers.delete(generateHashKey(handler));
      this.logger && this.logger.info(`EventBus cleared event listener: [${name}]`)
    }
  }

  cleanup(){
    this._eventMap = new Map();
  }

  trigger(name, ...parameters) {
    const handlers = this._eventMap.get(name);
    if (handlers) {
      this.logger && this.logger.info(`Event: [${name}] in EventBus is triggered.`);
      for (const handler of handlers.values()) {
        handler(...parameters);
      }
    }
    // Ignoring silently incase of non registered event
  }
}

function generateHashKey(handler) {
  if (handler.toString().includes('[native code]')) {
    return createHashCode(handler.name);
  } else {
    return createHashCode(handler);
  }
}

function createHashCode(handler) {
  let hash = 0;
  for (let i = 0; i < handler.length; i++) {
      let char = handler.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
  }
  return hash;
}

export default new EventBus();