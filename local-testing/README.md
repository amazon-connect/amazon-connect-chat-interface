## Example Test Page

This folder has an example html page that you can use to test your code. You will need the amazon-connect-chat-interface.js compiled code from this project and the example solution to start chat using API Gateway and Lambda backend components as defined in [this GitHub repo](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI).

## Steps
1. Follow the steps in [this repo](https://github.com/amazon-connect/amazon-connect-chat-ui-examples/tree/master/cloudformationTemplates/startChatContactAPI) to deploy the backend pieces to start a chat.
2. Follow the steps in the main [README](../README.md) of this GitHub repo to compile the code and generate the `amazon-connect-chat-interface.js` file.
3. Once you have generated the `amazon-connect-chat-interface.js`, copy it into this directory.
4. Modify the [index.html](./index.html) file to include the values used as parameters (contact id, instance id, and region) and created as an output in step 1 (API Gateway endpoint URL). All the necessary variables are marked by "TODO".
5. Using the command line, install http-server by running `npm install -g http-server`
5. Navigate to the `local-testing` folder and run the code locally by running `http-server`
6. Open `http://127.0.0.1:8080/` in your browser.
7. To test, enter your name and click `Start Chat`, it will trigger the API Gateway endpoint to start the chat and then establish the chat on the front end.