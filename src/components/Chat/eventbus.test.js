describe('Eventbus', () => {
    let instance;
    beforeEach(async () => {
      window.connect = {
        LogManager: {
          getLogger: function(obj) {
            return {
              debug: jest.fn(),
              info: jest.fn(),
              error: jest.fn()
            }
          }
        }
      }
      instance = await import('./eventbus');
    })
    
    afterEach(() => {
      delete window.connect;
    })
  
    test("Logger object should be initialized when class is created", () => {
      expect(instance.default.logger).not.toBeUndefined();
    })
  
    test("Info method should be called after 'on' method is called with two params.", () => {
      instance.default.on("incoming-message", jest.fn());
      expect(instance.default.logger.info).toBeCalled();
    })
  
    test("Error method should be called after 'on' method is called with no param.", () => {
      instance.default.on();
      expect(instance.default.logger.error).toBeCalled();
    })
  
    test("Info method should be called after 'off' method is called without handler.", () => {
      instance.default.off("incoming-message");
      expect(instance.default.logger.info).toBeCalled();
    })
  
    test("Info method should be called after 'off' method is called with event name and handler.", () => {
      const handler = function() {};
      instance.default.on("incoming-message", handler);
      instance.default.off("incoming-message", handler);
      expect(instance.default.logger.info).toBeCalled();
      expect(instance.default._eventMap.get("incoming-message").size).toBe(0);
    })
  
    test("Info method should be called after 'trigger' method is called with event name.", () => {
      const handler = function() {};
      instance.default.on("incoming-message", handler);
      instance.default.trigger("incoming-message");
      expect(instance.default.logger.info).toBeCalled();
    })
  
    test("Event map should not be able to add duplicate functions.", () => {
      const handler = function(){return 'a'};
      instance.default.on("initChat", handler);
      expect(instance.default._eventMap.get("initChat").size).toBe(1);
      instance.default.on("initChat", handler);
      expect(instance.default._eventMap.get("initChat").size).toBe(1);
    })
  });
  