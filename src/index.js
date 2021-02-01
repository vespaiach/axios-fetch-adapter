import settle from 'axios/lib/core/settle';
import createError from 'axios/lib/core/createError';
import createRequest from './createRequest';
import getResponse from './getResponse';

/**
 * - Create a request
 * - Get response
 * - Check if timeout
 */
export default async function fetchAdapter(config) {
    const request = createRequest(config);
    const promiseChain = [getResponse(request, config)];

    if (config.timeout && config.timeout > 0) {
        promiseChain.push(
            new Promise((res) => {
                setTimeout(() => {
                    const message = config.timeoutErrorMessage
                        ? config.timeoutErrorMessage
                        : 'timeout of ' + config.timeout + 'ms exceeded';
                    res(createError(message, config, 'ECONNABORTED', request));
                }, config.timeout);
            })
        );
    }

    const data = await Promise.race(promiseChain);
    return new Promise((resolve, reject) => {
        if (data instanceof Error) {
            reject(data);
        } else {
            settle(resolve, reject, data);
        }
    });
}
