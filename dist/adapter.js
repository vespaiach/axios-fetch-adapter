(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios/lib/core/settle'), require('axios/lib/core/createError'), require('axios/lib/helpers/buildURL'), require('axios/lib/core/buildFullPath'), require('axios/lib/utils')) :
  typeof define === 'function' && define.amd ? define(['axios/lib/core/settle', 'axios/lib/core/createError', 'axios/lib/helpers/buildURL', 'axios/lib/core/buildFullPath', 'axios/lib/utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.fetchAdapter = factory(global.settle, global.createError, global.buildURL, global.buildFullPath, global.utils));
}(this, (function (settle, createError, buildURL, buildFullPath, utils) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var settle__default = /*#__PURE__*/_interopDefaultLegacy(settle);
  var createError__default = /*#__PURE__*/_interopDefaultLegacy(createError);
  var buildURL__default = /*#__PURE__*/_interopDefaultLegacy(buildURL);
  var buildFullPath__default = /*#__PURE__*/_interopDefaultLegacy(buildFullPath);

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

  /**
   * This function will create a Request object based on configuration's axios
   */

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


    if (!utils.isUndefined(config.withCredentials)) {
      options.credentials = config.withCredentials ? 'include' : 'omit';
    }

    var fullPath = buildFullPath__default['default'](config.baseURL, config.url);
    var url = buildURL__default['default'](fullPath, config.params, config.paramsSerializer); // Expected browser to throw error if there is any wrong configuration value

    return new Request(url, options);
  }

  /**
   * Fetch API stage two is to get response body. This funtion tries to retrieve
   * response body based on response's type
   */

  function getResponse(_x, _x2) {
    return _getResponse.apply(this, arguments);
  }

  function _getResponse() {
    _getResponse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, config) {
      var stageOne, response;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return fetch(request);

            case 3:
              stageOne = _context.sent;
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", Promise.reject(createError__default['default']('Network Error', config, null, request)));

            case 9:
              response = {
                ok: stageOne.ok,
                status: stageOne.status,
                statusText: stageOne.statusText,
                headers: new Headers(stageOne.headers),
                // Make a copy of headers
                config: config,
                request: request
              };

              if (!(stageOne.status >= 200 && stageOne.status !== 204)) {
                _context.next = 34;
                break;
              }

              _context.t1 = config.responseType;
              _context.next = _context.t1 === 'arraybuffer' ? 14 : _context.t1 === 'blob' ? 18 : _context.t1 === 'json' ? 22 : _context.t1 === 'formData' ? 26 : 30;
              break;

            case 14:
              _context.next = 16;
              return stageOne.arrayBuffer();

            case 16:
              response.data = _context.sent;
              return _context.abrupt("break", 34);

            case 18:
              _context.next = 20;
              return stageOne.blob();

            case 20:
              response.data = _context.sent;
              return _context.abrupt("break", 34);

            case 22:
              _context.next = 24;
              return stageOne.json();

            case 24:
              response.data = _context.sent;
              return _context.abrupt("break", 34);

            case 26:
              _context.next = 28;
              return stageOne.formData();

            case 28:
              response.data = _context.sent;
              return _context.abrupt("break", 34);

            case 30:
              _context.next = 32;
              return stageOne.text();

            case 32:
              response.data = _context.sent;
              return _context.abrupt("break", 34);

            case 34:
              return _context.abrupt("return", Promise.resolve(response));

            case 35:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }));
    return _getResponse.apply(this, arguments);
  }

  /**
   * - Create a request object
   * - Get response body
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
              promiseChain = [getResponse(request, config)];

              if (config.timeout && config.timeout > 0) {
                promiseChain.push(new Promise(function (res) {
                  setTimeout(function () {
                    var message = config.timeoutErrorMessage ? config.timeoutErrorMessage : 'timeout of ' + config.timeout + 'ms exceeded';
                    res(createError__default['default'](message, config, 'ECONNABORTED', request));
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
                  Object.prototype.toString.call(config.settle) === '[object Function]' ? config.settle(resolve, reject, data) : settle__default['default'](resolve, reject, data);
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

  return fetchAdapter;

})));
