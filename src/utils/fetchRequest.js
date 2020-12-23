/**
 * Wrapper for window.fetch request.
 * 
 * Throws errors for 4xx and 5xx, since fetch does not throw on these by default.
 * 
 * https://github.com/github/fetch/issues/203
 */

import 'whatwg-fetch';

/**
 * Requests a URL, returning a promise.
 * 
 * Rejects with a `networkError` since fetch only rejects on network errors.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {Promise}          The request promise
 */
export default function request(url, options) {
  return new Promise((resolve, reject) => {
    window.fetch(url, options)
      .then(parseJSON)
      .then((response) => response.ok ? resolve(response) : reject(response))
      .catch((error) => reject({
        networkError: error.message,
      }));
  });
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
function parseJSON(response) {
  return new Promise((resolve) => response.json()
    .then((json) => resolve({
      status: response.status,
      ok: response.ok,
      json,
    })));
}
