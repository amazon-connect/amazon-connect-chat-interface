import { config } from "./utils/log";

const globalConfig = {
    loggerConfig: config,
    features: {
      messageReceipts: {
        shouldSendMessageReceipts: true,
        throttleTime: 5000
      }
    }
}

export default globalConfig