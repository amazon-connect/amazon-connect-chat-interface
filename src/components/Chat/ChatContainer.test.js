import React from 'react';
import ChatContainer from './ChatContainer';


describe('<ChatContainer />', () => {
    let wrapper, instance;
    beforeAll(() => {
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
        wrapper = shallow(<ChatContainer />);
        instance = wrapper.instance();
    })

    afterAll(() => {
        delete window.connect;
    })

    test("Logger object should be initialized when component is created", () => {
        expect(instance.logger).not.toBeUndefined();
    })

    test("Info method should be called after initiateChatSession method is called.", () => {
        const chatDetails = {"contactFlowId":"aa","instanceId":"cc","region":"us-west-2","stage":"prod","featurePermissions":{"ATTACHMENTS":true},"apiGatewayEndpoint":"https://dnrnq60io4.execute-api.us-west-2.amazonaws.com/Prod"}
        instance.initiateChatSession(chatDetails);
        expect(instance.logger.info).toBeCalled();
    })

    test("Info method should be called after resetState method is called.", () => {
        instance.resetState();
        expect(instance.logger.info).toBeCalled();
    })
});
