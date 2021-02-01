import settle from 'axios/lib/core/settle';
import createError from 'axios/lib/core/createError';
import buildURL from 'axios/lib/helpers/buildURL';
import buildFullPath from 'axios/lib/core/buildFullPath';
import { isUndefined } from 'axios/lib/utils';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function createRequest(config) {
  var headers = new Headers(config.headers); // HTTP basic authentication

  if (config.auth) {
    var username = config.auth.username || '';
    var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
    headers.set('Authorization', "Basic ".concat(btoa(username + ':' + password)));
  }

  var method = config.method.toUpperCase();
  var options = {
    headers: headers,
    method: method
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
    options.integrity = config.referrer;
  } // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
  // So if withCredentials is not set, default value 'same-origin' will be used


  if (!isUndefined(config.withCredentials)) {
    options.credentials = config.withCredentials ? 'include' : 'omit';
  }

  var fullPath = buildFullPath(config.baseURL, config.url);
  var url = buildURL(fullPath, config.params, config.paramsSerializer); // Expected browser to throw error if there is any wrong configuration value

  return new Request(url, options);
}

/**
 * - Create a request
 * - Get response
 * - Check if timeout
 */

function fetchAdapter(_x) {
  return _fetchAdapter.apply(this, arguments);
}

function _fetchAdapter() {
  _fetchAdapter = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
    var request, promiseChain, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            request = createRequest(config);
            promiseChain = [call(request, config)];

            if (config.timeout && config.timeout > 0) {
              promiseChain.push(new Promise(function (res) {
                setTimeout(function () {
                  var message = config.timeoutErrorMessage ? config.timeoutErrorMessage : 'timeout of ' + config.timeout + 'ms exceeded';
                  res(createError(message, config, 'ECONNABORTED', request));
                }, config.timeout);
              }));
            }

            _context.next = 5;
            return Promise.race(promiseChain);

          case 5:
            data = _context.sent;
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              if (data instanceof Error) {
                reject(data);
              } else {
                settle(resolve, reject, data);
              }
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _fetchAdapter.apply(this, arguments);
}

export default fetchAdapter;
