// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/**
 * Simple utitlity for for Event subscription
 */

class EventBus {

  constructor() {
    this._eventMap = {};
    if(window.connect && window.connect.LogManager) {
      this.logger = window.connect.LogManager.getLogger({ prefix: "ChatInterface-EventBus" });
    }
  }

  on(name, handler) {
    if (name && handler) {
      this._eventMap[name] = this._eventMap[name] || [];
      this._eventMap[name].push(handler);
      this.logger && this.logger.info(`EventBus added event: [${name}].`);
    } else {
      this.logger && this.logger.error("For binding an event 'name' and 'handler' is mandatory", "provided parameters are", name, handler)
    }
  }

  off(name, handler) {
    if (!handler) {
      delete this._eventMap[name];
      this.logger && this.logger.info(`EventBus cleared all event listeners: [${name}]`);
      return;
    }

    if (this._eventMap[name]) {
      const idx = this._eventMap[name].indexOf(handler);
      this.logger && this.logger.info(`EventBus cleared event listener: [${name}]`)
      if (idx !== -1) {
        this._eventMap[name].splice(idx);
      }
    }
  }

  cleanup(){
    this._eventMap = {};
  }

  trigger(name, ...parameters) {
    if (this._eventMap[name]) {
      this.logger && this.logger.info(`Event: [${name}] in EventBus is triggered.`)
      this._eventMap[name].forEach(function (handler) {
        handler(...parameters);
      });
    }
    // Ignoring silently incase of non registered event
  }
}

export default new EventBus();