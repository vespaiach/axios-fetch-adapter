import buildURL from 'axios/lib/helpers/buildURL';
import buildFullPath from 'axios/lib/core/buildFullPath';
import { isUndefined } from 'axios/lib/utils';

/**
 * This function will create a Request object based on configuration's axios
 */
export default function createRequest(config) {
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
        options.integrity = config.redirect;
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
