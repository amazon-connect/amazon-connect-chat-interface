import { initiateChat } from './ChatInitiator';
import request from '../../utils/fetchRequest';

jest.mock('../../utils/fetchRequest');

const input = {
  apiGatewayEndpoint: 'https://localhost:3000',
  name: 'Tester',
};

const resolvedRes = {
  json: {
    data: [1, 2, 3],
  },
}

Object.freeze(input);

beforeEach(() => {
  request.mockResolvedValue(resolvedRes);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('should attach headers from the input, if supplied', async () => {
  const inputWithHeaders = {
    ...input,
    headers: {
      testHeader: 'testHeaderValue',
    },
  };
  await initiateChat(inputWithHeaders);

  expect(request).toHaveBeenCalledTimes(1);
  expect(request).toHaveBeenCalledWith(input.apiGatewayEndpoint, {
    headers: inputWithHeaders.headers,
    method: 'post',
    body: JSON.stringify({
      ParticipantDetails: {
        DisplayName: inputWithHeaders.name
      }
    })
  });
});

it('should resolve with the response json.data', async () => {
  const result = await initiateChat(input);

  expect(result).toEqual(resolvedRes.json.data);
});