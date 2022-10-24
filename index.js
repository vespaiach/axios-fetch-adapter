import axios from 'axios';
import settle from 'axios/lib/core/settle';
import buildURL from 'axios/lib/helpers/buildURL';
import buildFullPath from 'axios/lib/core/buildFullPath';
import { isUndefined, isStandardBrowserEnv, isFormData } from 'axios/lib/utils';

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
export default async function fetchAdapter(config) {
    const request = createRequest(config);
    const stageOne = await startFetch(request, config);
    const data = getResponse(stageOne)
    const theSettle = config.settle instanceof Function
        ? config.settle
        : settle;
    return new Promise((resolve, reject) => {
        theSettle(resolve, reject, data);
    })
}

async function startFetch(request, config) {
    const createNetworkError = () => {
        const networkError = createError('Network Error', config, 'ERR_NETWORK', request);
        return networkError;
    }

    if (typeof config.time !== 'number' || isNaN(config.time) || config.time <= 0) {
        try {
            return await fetch(request);
        } catch {
            throw createNetworkError();
        }
    }

    const createTimeoutError = () => {
        const message = config.timeoutErrorMessage
        ? config.timeoutErrorMessage
        : 'timeout of ' + config.timeout + 'ms exceeded';
        const timeoutError = createError(message, config, 'ECONNABORTED', request);
        return timeoutError;
    };

    try {
        var abortController = new AbortController()
    } catch (error) {
        return new Promise(async(resolve, reject) => {
            const rejectTimeout = () => {
                reject(createTimeoutError())
            };
            setTimeout(rejectTimeout, time);
            try {
                resolve(await fetch(request));
            } catch(error) {
                rejectTimeout();
            }
        })
    }

    setTimeout(() => {
        abortController.abort()
    }, config.timeout);

    try {
        return await fetch(request, { 
            signal: abortController.signal
        });
    } catch (error) {
        if (abortController.signal.aborted) {
            throw createTimeoutError();
        }
    
        throw createNetworkError();
    }
}


/**
 * Fetch API stage two is to get response body. This funtion tries to retrieve
 * response body based on response's type
 */
async function getResponse(stageOne, config) {
    const response = {
        ok: stageOne.ok,
        status: stageOne.status,
        statusText: stageOne.statusText,
        headers: new Headers(stageOne.headers), // Make a copy of headers
        config: config,
        request,
    };

    if (stageOne.status >= 200 && stageOne.status !== 204) {
        switch (config.responseType) {
            case 'arraybuffer':
                response.data = await stageOne.arrayBuffer();
                break;
            case 'blob':
                response.data = await stageOne.blob();
                break;
            case 'json':
                response.data = await stageOne.json();
                break;
            case 'formData':
                response.data = await stageOne.formData();
                break;
            default:
                response.data = await stageOne.text();
                break;
        }
    }

    return response;
}

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config) {
    // Fix bug https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    if (config.data instanceof FormData && config.headers) {
        const ContentType = 'Content-Type';
        delete config.headers[ContentType];
        delete config.headers[ContentType.toLowerCase()];
        delete config.headers[ContentType.toUpperCase()];
    }

    const headers = new Headers(config.headers);

    // HTTP basic authentication
    if (config.auth) {
        const username = config.auth.username || '';
        const password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : '';
        headers.set('Authorization', `Basic ${btoa(username + ':' + password)}`);
    }

    const method = config.method.toUpperCase();
    const options = {
        headers: headers,
        method,
    };
    if (method !== 'GET' && method !== 'HEAD') {
        options.body = config.data;

        // In these cases the browser will automatically set the correct Content-Type,
        // but only if that header hasn't been set yet. So that's why we're deleting it.
        if (isFormData(options.body) && isStandardBrowserEnv()) {
            headers.delete('Content-Type');
        }
    }
    if (config.mode) {
        options.mode = config.mode;
    }
    if (config.cache) {
        options.cache = config.cache;
    }
    if (config.integrity) {
        options.integrity = config.integrity;
    }
    if (config.redirect) {
        options.redirect = config.redirect;
    }
    if (config.referrer) {
        options.referrer = config.referrer;
    }
    // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used
    if (!isUndefined(config.withCredentials)) {
        options.credentials = config.withCredentials ? 'include' : 'omit';
    }

    const fullPath = buildFullPath(config.baseURL, config.url);
    const url = buildURL(fullPath, config.params, config.paramsSerializer);

    // Expected browser to throw error if there is any wrong configuration value
    return new Request(url, options);
}



/**
 * Note:
 * 
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 * 
 * 
 * 
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function createError(message, config, code, request, response) {
    if (axios.AxiosError && typeof axios.AxiosError === 'function') {
        return new axios.AxiosError(message, axios.AxiosError[code], config, request, response);
    }

    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
};

/**
 * 
 * Note:
 * 
 *   This function is for backward compatible.
 * 
 *  
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};
