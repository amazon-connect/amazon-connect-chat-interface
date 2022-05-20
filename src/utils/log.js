/* Add your own logger function here
  var customizedLogger = {
    debug: (data) => {// customize logger function here},
    info: (data) => {// customize logger function here},
    error: (data) => {// customize logger function here}
  }
  "connect" is a global object that exported from src/components/Chat/amazon-connect-chat.js
  There are four levels available from connect.LogLevel - DEBUG, INFO, ERROR.
*/
export const config = {
    loggerConfig: {
        // Add your logger here
        // customizedLogger: customizedLogger,
        level: connect.LogLevel.INFO,
        useDefaultLogger: true
    },
};
