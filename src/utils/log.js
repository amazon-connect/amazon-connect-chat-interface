/* Add your own logger function here
  var customizedLogger = {
    debug: (data) => {// customize logger function here}, 10
    info: (data) => {// customize logger function here}, 20
    warn(data) {} =>  {// customize logger function here}, 30
    error: (data) => {// customize logger function here}, 40
    advancedLog: (data) => {// customize logger function here}, 50
  }
  "connect" is a global object that exported from src/components/Chat/amazon-connect-chat.js
  There are five levels available from connect.LogLevel - DEBUG, INFO, WARN, ERROR, ADVANCED_LOG.
  For local development and production loggerLevel DEBUG will print all logs to the logger or browser console.
*/
export const config = {
  loggerConfig: {
    // logger/customizedLogger: Add your logger here
    // customizedLogger: customizedLogger,
    level: connect.LogLevel.DEBUG,
    useDefaultLogger: true,
    //useDefaultLogger uses window.console
    //advancedLogWriter: can have `info`,`warn`,`debug`,`error` - default value is `warn`
  },
};