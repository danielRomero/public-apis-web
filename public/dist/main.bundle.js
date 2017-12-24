/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _amber = __webpack_require__(1);

var _amber2 = _interopRequireDefault(_amber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(2);
__webpack_require__(10);
__webpack_require__(11);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EVENTS = {
  join: 'join',
  leave: 'leave',
  message: 'message'
};
var STALE_CONNECTION_THRESHOLD_SECONDS = 100;
var SOCKET_POLLING_RATE = 10000;

/**
 * Returns a numeric value for the current time
 */
var now = function now() {
  return new Date().getTime();
};

/**
 * Returns the difference between the current time and passed `time` in seconds
 * @param {Number|Date} time - A numeric time or date object
 */
var secondsSince = function secondsSince(time) {
  return (now() - time) / 1000;
};

/**
 * Class for channel related functions (joining, leaving, subscribing and sending messages)
 */

var Channel = exports.Channel = function () {
  /**
   * @param {String} topic - topic to subscribe to
   * @param {Socket} socket - A Socket instance
   */
  function Channel(topic, socket) {
    _classCallCheck(this, Channel);

    this.topic = topic;
    this.socket = socket;
    this.onMessageHandlers = [];
  }

  /**
   * Join a channel, subscribe to all channels messages
   */


  _createClass(Channel, [{
    key: 'join',
    value: function join() {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.join, topic: this.topic }));
    }

    /**
     * Leave a channel, stop subscribing to channel messages
     */

  }, {
    key: 'leave',
    value: function leave() {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.leave, topic: this.topic }));
    }

    /**
     * Calls all message handlers with a matching subject
     */

  }, {
    key: 'handleMessage',
    value: function handleMessage(msg) {
      this.onMessageHandlers.forEach(function (handler) {
        if (handler.subject === msg.subject) handler.callback(msg.payload);
      });
    }

    /**
     * Subscribe to a channel subject
     * @param {String} subject - subject to listen for: `msg:new`
     * @param {function} callback - callback function when a new message arrives
     */

  }, {
    key: 'on',
    value: function on(subject, callback) {
      this.onMessageHandlers.push({ subject: subject, callback: callback });
    }

    /**
     * Send a new message to the channel
     * @param {String} subject - subject to send message to: `msg:new`
     * @param {Object} payload - payload object: `{message: 'hello'}`
     */

  }, {
    key: 'push',
    value: function push(subject, payload) {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.message, topic: this.topic, subject: subject, payload: payload }));
    }
  }]);

  return Channel;
}();

/**
 * Class for maintaining connection with server and maintaining channels list
 */


var Socket = exports.Socket = function () {
  /**
   * @param {String} endpoint - Websocket endpont used in routes.cr file
   */
  function Socket(endpoint) {
    _classCallCheck(this, Socket);

    this.endpoint = endpoint;
    this.ws = null;
    this.channels = [];
    this.lastPing = now();
    this.reconnectTries = 0;
    this.attemptReconnect = true;
  }

  /**
   * Returns whether or not the last received ping has been past the threshold
   */


  _createClass(Socket, [{
    key: '_connectionIsStale',
    value: function _connectionIsStale() {
      return secondsSince(this.lastPing) > STALE_CONNECTION_THRESHOLD_SECONDS;
    }

    /**
     * Tries to reconnect to the websocket server using a recursive timeout
     */

  }, {
    key: '_reconnect',
    value: function _reconnect() {
      var _this = this;

      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(function () {
        _this.reconnectTries++;
        _this.connect(_this.params);
        _this._reconnect();
      }, this._reconnectInterval());
    }

    /**
     * Returns an incrementing timeout interval based around the number of reconnection retries
     */

  }, {
    key: '_reconnectInterval',
    value: function _reconnectInterval() {
      return [1000, 2000, 5000, 10000][this.reconnectTries] || 10000;
    }

    /**
     * Sets a recursive timeout to check if the connection is stale
     */

  }, {
    key: '_poll',
    value: function _poll() {
      var _this2 = this;

      this.pollingTimeout = setTimeout(function () {
        if (_this2._connectionIsStale()) {
          _this2._reconnect();
        } else {
          _this2._poll();
        }
      }, SOCKET_POLLING_RATE);
    }

    /**
     * Clear polling timeout and start polling
     */

  }, {
    key: '_startPolling',
    value: function _startPolling() {
      clearTimeout(this.pollingTimeout);
      this._poll();
    }

    /**
     * Sets `lastPing` to the curent time
     */

  }, {
    key: '_handlePing',
    value: function _handlePing() {
      this.lastPing = now();
    }

    /**
     * Clears reconnect timeout, resets variables an starts polling
     */

  }, {
    key: '_reset',
    value: function _reset() {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTries = 0;
      this.attemptReconnect = true;
      this._startPolling();
    }

    /**
     * Connect the socket to the server, and binds to native ws functions
     * @param {Object} params - Optional parameters
     * @param {String} params.location - Hostname to connect to, defaults to `window.location.hostname`
     * @param {String} parmas.port - Port to connect to, defaults to `window.location.port`
     * @param {String} params.protocol - Protocol to use, either 'wss' or 'ws'
     */

  }, {
    key: 'connect',
    value: function connect(params) {
      var _this3 = this;

      this.params = params;

      var opts = {
        location: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      };

      if (params) Object.assign(opts, params);
      if (opts.port) opts.location += ':' + opts.port;

      return new Promise(function (resolve, reject) {
        _this3.ws = new WebSocket(opts.protocol + '//' + opts.location + _this3.endpoint);
        _this3.ws.onmessage = function (msg) {
          _this3.handleMessage(msg);
        };
        _this3.ws.onclose = function () {
          if (_this3.attemptReconnect) _this3._reconnect();
        };
        _this3.ws.onopen = function () {
          _this3._reset();
          resolve();
        };
      });
    }

    /**
     * Closes the socket connection permanently
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.attemptReconnect = false;
      clearTimeout(this.pollingTimeout);
      clearTimeout(this.reconnectTimeout);
      this.ws.close();
    }

    /**
     * Adds a new channel to the socket channels list
     * @param {String} topic - Topic for the channel: `chat_room:123`
     */

  }, {
    key: 'channel',
    value: function channel(topic) {
      var channel = new Channel(topic, this);
      this.channels.push(channel);
      return channel;
    }

    /**
     * Message handler for messages received
     * @param {MessageEvent} msg - Message received from ws
     */

  }, {
    key: 'handleMessage',
    value: function handleMessage(msg) {
      if (msg.data === "ping") return this._handlePing();

      var parsed_msg = JSON.parse(msg.data);
      this.channels.forEach(function (channel) {
        if (channel.topic === parsed_msg.topic) channel.handleMessage(parsed_msg);
      });
    }
  }]);

  return Socket;
}();

module.exports = {
  Socket: Socket
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener('DOMContentLoaded', function () {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener('DOMContentLoaded', function () {

  // Get all "tabs" elements
  var $tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs ul li'), 0);

  // Check if there are any tabs
  if ($tabs.length > 0) {

    // Add a click event on each of them
    $tabs.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Hide all active elements
        var $allTabs = Array.prototype.slice.call(document.querySelectorAll('.tabs ul li'), 0);
        $allTabs.forEach(function ($tab) {
          $tab.classList.remove('is-active');
        });

        var $apiDocContent = Array.prototype.slice.call(document.querySelectorAll('.api-doc.content'), 0);
        $apiDocContent.forEach(function ($doc_content) {
          $doc_content.classList.add('is-hidden');
        });

        // Get the target from the "data-target" attribute
        var anchor = $el.querySelector('a');
        var target = anchor.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "tabs-menu" and the "tabs-content"
        $el.classList.add('is-active');
        $target.classList.remove('is-hidden');
      });
    });
  }
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


document.addEventListener('DOMContentLoaded', function () {

  // Get all "anchor" elements starting at #
  var $anchors = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'), 0);

  // Check if there are any anchor starting at #
  if ($anchors.length > 0) {

    // Add a click event on each of them
    $anchors.forEach(function ($el) {
      $el.addEventListener('click', function () {

        location.hash = $el.getAttribute("href");
      });
    });
  }
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWM4ZDAxN2MwMDhiOTA5YTNjMzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9tYWluLmpzIiwid2VicGFjazovLy8uL2xpYi9hbWJlci9hc3NldHMvanMvYW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9idXJndWVyX21lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy90YWJzX21lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9zY3JvbGxfdG9fYW5jaG9yLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFVkVOVFMiLCJqb2luIiwibGVhdmUiLCJtZXNzYWdlIiwiU1RBTEVfQ09OTkVDVElPTl9USFJFU0hPTERfU0VDT05EUyIsIlNPQ0tFVF9QT0xMSU5HX1JBVEUiLCJub3ciLCJEYXRlIiwiZ2V0VGltZSIsInNlY29uZHNTaW5jZSIsInRpbWUiLCJDaGFubmVsIiwidG9waWMiLCJzb2NrZXQiLCJvbk1lc3NhZ2VIYW5kbGVycyIsIndzIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJldmVudCIsIm1zZyIsImZvckVhY2giLCJoYW5kbGVyIiwic3ViamVjdCIsImNhbGxiYWNrIiwicGF5bG9hZCIsInB1c2giLCJTb2NrZXQiLCJlbmRwb2ludCIsImNoYW5uZWxzIiwibGFzdFBpbmciLCJyZWNvbm5lY3RUcmllcyIsImF0dGVtcHRSZWNvbm5lY3QiLCJjbGVhclRpbWVvdXQiLCJyZWNvbm5lY3RUaW1lb3V0Iiwic2V0VGltZW91dCIsImNvbm5lY3QiLCJwYXJhbXMiLCJfcmVjb25uZWN0IiwiX3JlY29ubmVjdEludGVydmFsIiwicG9sbGluZ1RpbWVvdXQiLCJfY29ubmVjdGlvbklzU3RhbGUiLCJfcG9sbCIsIl9zdGFydFBvbGxpbmciLCJvcHRzIiwibG9jYXRpb24iLCJ3aW5kb3ciLCJob3N0bmFtZSIsInBvcnQiLCJwcm90b2NvbCIsIk9iamVjdCIsImFzc2lnbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiV2ViU29ja2V0Iiwib25tZXNzYWdlIiwiaGFuZGxlTWVzc2FnZSIsIm9uY2xvc2UiLCJvbm9wZW4iLCJfcmVzZXQiLCJjbG9zZSIsImNoYW5uZWwiLCJkYXRhIiwiX2hhbmRsZVBpbmciLCJwYXJzZWRfbXNnIiwicGFyc2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiJG5hdmJhckJ1cmdlcnMiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJsZW5ndGgiLCIkZWwiLCJ0YXJnZXQiLCJkYXRhc2V0IiwiJHRhcmdldCIsImdldEVsZW1lbnRCeUlkIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwiJHRhYnMiLCIkYWxsVGFicyIsIiR0YWIiLCJyZW1vdmUiLCIkYXBpRG9jQ29udGVudCIsIiRkb2NfY29udGVudCIsImFkZCIsImFuY2hvciIsInF1ZXJ5U2VsZWN0b3IiLCIkYW5jaG9ycyIsImhhc2giLCJnZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTs7Ozs7O0FBQ0EsbUJBQUFBLENB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Z0JBQVQsQ0FBMEIsY0FBMUIsQ0FBM0IsRUFBc0UsQ0FBdEUsQ0FBZjs7QUFFQTtBQUNBLE1BQUlrQixTQUFTakIsTUFBVCxHQUFrQixDQUF0QixFQUF5Qjs7QUFFdkI7QUFDQWlCLGFBQVN6RSxPQUFULENBQWlCLFVBQVV5RCxHQUFWLEVBQWU7QUFDOUJBLFVBQUlSLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFlBQVk7O0FBRXhDekIsaUJBQVNrRCxJQUFULEdBQWdCakIsSUFBSWtCLFlBQUosQ0FBaUIsTUFBakIsQ0FBaEI7QUFFRCxPQUpEO0FBS0QsS0FORDtBQU9EO0FBRUYsQ0FsQkQsRSIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0XCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWM4ZDAxN2MwMDhiOTA5YTNjMzkiLCJpbXBvcnQgQW1iZXIgZnJvbSAnYW1iZXInO1xucmVxdWlyZSgnLi9idXJndWVyX21lbnUuanMnKTtcbnJlcXVpcmUoJy4vdGFic19tZW51LmpzJyk7XG5yZXF1aXJlKCcuL3Njcm9sbF90b19hbmNob3IuanMnKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NldHMvamF2YXNjcmlwdHMvbWFpbi5qcyIsImNvbnN0IEVWRU5UUyA9IHtcbiAgam9pbjogJ2pvaW4nLFxuICBsZWF2ZTogJ2xlYXZlJyxcbiAgbWVzc2FnZTogJ21lc3NhZ2UnXG59XG5jb25zdCBTVEFMRV9DT05ORUNUSU9OX1RIUkVTSE9MRF9TRUNPTkRTID0gMTAwXG5jb25zdCBTT0NLRVRfUE9MTElOR19SQVRFID0gMTAwMDBcblxuLyoqXG4gKiBSZXR1cm5zIGEgbnVtZXJpYyB2YWx1ZSBmb3IgdGhlIGN1cnJlbnQgdGltZVxuICovXG5sZXQgbm93ID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKClcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGN1cnJlbnQgdGltZSBhbmQgcGFzc2VkIGB0aW1lYCBpbiBzZWNvbmRzXG4gKiBAcGFyYW0ge051bWJlcnxEYXRlfSB0aW1lIC0gQSBudW1lcmljIHRpbWUgb3IgZGF0ZSBvYmplY3RcbiAqL1xubGV0IHNlY29uZHNTaW5jZSA9ICh0aW1lKSA9PiB7XG4gIHJldHVybiAobm93KCkgLSB0aW1lKSAvIDEwMDBcbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgY2hhbm5lbCByZWxhdGVkIGZ1bmN0aW9ucyAoam9pbmluZywgbGVhdmluZywgc3Vic2NyaWJpbmcgYW5kIHNlbmRpbmcgbWVzc2FnZXMpXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGFubmVsIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIHRvcGljIHRvIHN1YnNjcmliZSB0b1xuICAgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IC0gQSBTb2NrZXQgaW5zdGFuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRvcGljLCBzb2NrZXQpIHtcbiAgICB0aGlzLnRvcGljID0gdG9waWNcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldFxuICAgIHRoaXMub25NZXNzYWdlSGFuZGxlcnMgPSBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEpvaW4gYSBjaGFubmVsLCBzdWJzY3JpYmUgdG8gYWxsIGNoYW5uZWxzIG1lc3NhZ2VzXG4gICAqL1xuICBqb2luKCkge1xuICAgIHRoaXMuc29ja2V0LndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBldmVudDogRVZFTlRTLmpvaW4sIHRvcGljOiB0aGlzLnRvcGljIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIExlYXZlIGEgY2hhbm5lbCwgc3RvcCBzdWJzY3JpYmluZyB0byBjaGFubmVsIG1lc3NhZ2VzXG4gICAqL1xuICBsZWF2ZSgpIHtcbiAgICB0aGlzLnNvY2tldC53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgZXZlbnQ6IEVWRU5UUy5sZWF2ZSwgdG9waWM6IHRoaXMudG9waWMgfSkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgYWxsIG1lc3NhZ2UgaGFuZGxlcnMgd2l0aCBhIG1hdGNoaW5nIHN1YmplY3RcbiAgICovXG4gIGhhbmRsZU1lc3NhZ2UobXNnKSB7XG4gICAgdGhpcy5vbk1lc3NhZ2VIYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICBpZiAoaGFuZGxlci5zdWJqZWN0ID09PSBtc2cuc3ViamVjdCkgaGFuZGxlci5jYWxsYmFjayhtc2cucGF5bG9hZClcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSB0byBhIGNoYW5uZWwgc3ViamVjdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3ViamVjdCAtIHN1YmplY3QgdG8gbGlzdGVuIGZvcjogYG1zZzpuZXdgXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBhIG5ldyBtZXNzYWdlIGFycml2ZXNcbiAgICovXG4gIG9uKHN1YmplY3QsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbk1lc3NhZ2VIYW5kbGVycy5wdXNoKHsgc3ViamVjdDogc3ViamVjdCwgY2FsbGJhY2s6IGNhbGxiYWNrIH0pXG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG5ldyBtZXNzYWdlIHRvIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdWJqZWN0IC0gc3ViamVjdCB0byBzZW5kIG1lc3NhZ2UgdG86IGBtc2c6bmV3YFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZCAtIHBheWxvYWQgb2JqZWN0OiBge21lc3NhZ2U6ICdoZWxsbyd9YFxuICAgKi9cbiAgcHVzaChzdWJqZWN0LCBwYXlsb2FkKSB7XG4gICAgdGhpcy5zb2NrZXQud3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IGV2ZW50OiBFVkVOVFMubWVzc2FnZSwgdG9waWM6IHRoaXMudG9waWMsIHN1YmplY3Q6IHN1YmplY3QsIHBheWxvYWQ6IHBheWxvYWQgfSkpXG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgbWFpbnRhaW5pbmcgY29ubmVjdGlvbiB3aXRoIHNlcnZlciBhbmQgbWFpbnRhaW5pbmcgY2hhbm5lbHMgbGlzdFxuICovXG5leHBvcnQgY2xhc3MgU29ja2V0IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbmRwb2ludCAtIFdlYnNvY2tldCBlbmRwb250IHVzZWQgaW4gcm91dGVzLmNyIGZpbGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVuZHBvaW50KSB7XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50XG4gICAgdGhpcy53cyA9IG51bGxcbiAgICB0aGlzLmNoYW5uZWxzID0gW11cbiAgICB0aGlzLmxhc3RQaW5nID0gbm93KClcbiAgICB0aGlzLnJlY29ubmVjdFRyaWVzID0gMFxuICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBsYXN0IHJlY2VpdmVkIHBpbmcgaGFzIGJlZW4gcGFzdCB0aGUgdGhyZXNob2xkXG4gICAqL1xuICBfY29ubmVjdGlvbklzU3RhbGUoKSB7XG4gICAgcmV0dXJuIHNlY29uZHNTaW5jZSh0aGlzLmxhc3RQaW5nKSA+IFNUQUxFX0NPTk5FQ1RJT05fVEhSRVNIT0xEX1NFQ09ORFNcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmllcyB0byByZWNvbm5lY3QgdG8gdGhlIHdlYnNvY2tldCBzZXJ2ZXIgdXNpbmcgYSByZWN1cnNpdmUgdGltZW91dFxuICAgKi9cbiAgX3JlY29ubmVjdCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWNvbm5lY3RUaW1lb3V0KVxuICAgIHRoaXMucmVjb25uZWN0VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5yZWNvbm5lY3RUcmllcysrXG4gICAgICB0aGlzLmNvbm5lY3QodGhpcy5wYXJhbXMpXG4gICAgICB0aGlzLl9yZWNvbm5lY3QoKVxuICAgIH0sIHRoaXMuX3JlY29ubmVjdEludGVydmFsKCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpbmNyZW1lbnRpbmcgdGltZW91dCBpbnRlcnZhbCBiYXNlZCBhcm91bmQgdGhlIG51bWJlciBvZiByZWNvbm5lY3Rpb24gcmV0cmllc1xuICAgKi9cbiAgX3JlY29ubmVjdEludGVydmFsKCkge1xuICAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMCwgMTAwMDBdW3RoaXMucmVjb25uZWN0VHJpZXNdIHx8IDEwMDAwXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHJlY3Vyc2l2ZSB0aW1lb3V0IHRvIGNoZWNrIGlmIHRoZSBjb25uZWN0aW9uIGlzIHN0YWxlXG4gICAqL1xuICBfcG9sbCgpIHtcbiAgICB0aGlzLnBvbGxpbmdUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY29ubmVjdGlvbklzU3RhbGUoKSkge1xuICAgICAgICB0aGlzLl9yZWNvbm5lY3QoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcG9sbCgpXG4gICAgICB9XG4gICAgfSwgU09DS0VUX1BPTExJTkdfUkFURSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBwb2xsaW5nIHRpbWVvdXQgYW5kIHN0YXJ0IHBvbGxpbmdcbiAgICovXG4gIF9zdGFydFBvbGxpbmcoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucG9sbGluZ1RpbWVvdXQpXG4gICAgdGhpcy5fcG9sbCgpXG4gIH1cblxuICAvKipcbiAgICogU2V0cyBgbGFzdFBpbmdgIHRvIHRoZSBjdXJlbnQgdGltZVxuICAgKi9cbiAgX2hhbmRsZVBpbmcoKSB7XG4gICAgdGhpcy5sYXN0UGluZyA9IG5vdygpXG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHJlY29ubmVjdCB0aW1lb3V0LCByZXNldHMgdmFyaWFibGVzIGFuIHN0YXJ0cyBwb2xsaW5nXG4gICAqL1xuICBfcmVzZXQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dClcbiAgICB0aGlzLnJlY29ubmVjdFRyaWVzID0gMFxuICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCA9IHRydWVcbiAgICB0aGlzLl9zdGFydFBvbGxpbmcoKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgdGhlIHNvY2tldCB0byB0aGUgc2VydmVyLCBhbmQgYmluZHMgdG8gbmF0aXZlIHdzIGZ1bmN0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIC0gT3B0aW9uYWwgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFyYW1zLmxvY2F0aW9uIC0gSG9zdG5hbWUgdG8gY29ubmVjdCB0bywgZGVmYXVsdHMgdG8gYHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZWBcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhcm1hcy5wb3J0IC0gUG9ydCB0byBjb25uZWN0IHRvLCBkZWZhdWx0cyB0byBgd2luZG93LmxvY2F0aW9uLnBvcnRgXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMucHJvdG9jb2wgLSBQcm90b2NvbCB0byB1c2UsIGVpdGhlciAnd3NzJyBvciAnd3MnXG4gICAqL1xuICBjb25uZWN0KHBhcmFtcykge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zXG5cbiAgICBsZXQgb3B0cyA9IHtcbiAgICAgIGxvY2F0aW9uOiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUsXG4gICAgICBwb3J0OiB3aW5kb3cubG9jYXRpb24ucG9ydCxcbiAgICAgIHByb3RvY29sOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonID8gJ3dzczonIDogJ3dzOicsXG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcykgT2JqZWN0LmFzc2lnbihvcHRzLCBwYXJhbXMpXG4gICAgaWYgKG9wdHMucG9ydCkgb3B0cy5sb2NhdGlvbiArPSBgOiR7b3B0cy5wb3J0fWBcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLndzID0gbmV3IFdlYlNvY2tldChgJHtvcHRzLnByb3RvY29sfS8vJHtvcHRzLmxvY2F0aW9ufSR7dGhpcy5lbmRwb2ludH1gKVxuICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7IHRoaXMuaGFuZGxlTWVzc2FnZShtc2cpIH1cbiAgICAgIHRoaXMud3Mub25jbG9zZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXR0ZW1wdFJlY29ubmVjdCkgdGhpcy5fcmVjb25uZWN0KClcbiAgICAgIH1cbiAgICAgIHRoaXMud3Mub25vcGVuID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9yZXNldCgpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBzb2NrZXQgY29ubmVjdGlvbiBwZXJtYW5lbnRseVxuICAgKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmF0dGVtcHRSZWNvbm5lY3QgPSBmYWxzZVxuICAgIGNsZWFyVGltZW91dCh0aGlzLnBvbGxpbmdUaW1lb3V0KVxuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlY29ubmVjdFRpbWVvdXQpXG4gICAgdGhpcy53cy5jbG9zZSgpXG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBjaGFubmVsIHRvIHRoZSBzb2NrZXQgY2hhbm5lbHMgbGlzdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9waWMgLSBUb3BpYyBmb3IgdGhlIGNoYW5uZWw6IGBjaGF0X3Jvb206MTIzYFxuICAgKi9cbiAgY2hhbm5lbCh0b3BpYykge1xuICAgIGxldCBjaGFubmVsID0gbmV3IENoYW5uZWwodG9waWMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW5uZWwpXG4gICAgcmV0dXJuIGNoYW5uZWxcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXNzYWdlIGhhbmRsZXIgZm9yIG1lc3NhZ2VzIHJlY2VpdmVkXG4gICAqIEBwYXJhbSB7TWVzc2FnZUV2ZW50fSBtc2cgLSBNZXNzYWdlIHJlY2VpdmVkIGZyb20gd3NcbiAgICovXG4gIGhhbmRsZU1lc3NhZ2UobXNnKSB7XG4gICAgaWYgKG1zZy5kYXRhID09PSBcInBpbmdcIikgcmV0dXJuIHRoaXMuX2hhbmRsZVBpbmcoKVxuXG4gICAgbGV0IHBhcnNlZF9tc2cgPSBKU09OLnBhcnNlKG1zZy5kYXRhKVxuICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGNoYW5uZWwudG9waWMgPT09IHBhcnNlZF9tc2cudG9waWMpIGNoYW5uZWwuaGFuZGxlTWVzc2FnZShwYXJzZWRfbXNnKVxuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFNvY2tldDogU29ja2V0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvYW1iZXIvYXNzZXRzL2pzL2FtYmVyLmpzIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAvLyBHZXQgYWxsIFwibmF2YmFyLWJ1cmdlclwiIGVsZW1lbnRzXG4gIHZhciAkbmF2YmFyQnVyZ2VycyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXZiYXItYnVyZ2VyJyksIDApO1xuXG4gIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgbmF2YmFyIGJ1cmdlcnNcbiAgaWYgKCRuYXZiYXJCdXJnZXJzLmxlbmd0aCA+IDApIHtcblxuICAgIC8vIEFkZCBhIGNsaWNrIGV2ZW50IG9uIGVhY2ggb2YgdGhlbVxuICAgICRuYXZiYXJCdXJnZXJzLmZvckVhY2goZnVuY3Rpb24gKCRlbCkge1xuICAgICAgJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIEdldCB0aGUgdGFyZ2V0IGZyb20gdGhlIFwiZGF0YS10YXJnZXRcIiBhdHRyaWJ1dGVcbiAgICAgICAgdmFyIHRhcmdldCA9ICRlbC5kYXRhc2V0LnRhcmdldDtcbiAgICAgICAgdmFyICR0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXQpO1xuXG4gICAgICAgIC8vIFRvZ2dsZSB0aGUgY2xhc3Mgb24gYm90aCB0aGUgXCJuYXZiYXItYnVyZ2VyXCIgYW5kIHRoZSBcIm5hdmJhci1tZW51XCJcbiAgICAgICAgJGVsLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAkdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NldHMvamF2YXNjcmlwdHMvYnVyZ3Vlcl9tZW51LmpzIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAvLyBHZXQgYWxsIFwidGFic1wiIGVsZW1lbnRzXG4gIHZhciAkdGFicyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzIHVsIGxpJyksIDApO1xuXG4gIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgdGFic1xuICBpZiAoJHRhYnMubGVuZ3RoID4gMCkge1xuXG4gICAgLy8gQWRkIGEgY2xpY2sgZXZlbnQgb24gZWFjaCBvZiB0aGVtXG4gICAgJHRhYnMuZm9yRWFjaChmdW5jdGlvbiAoJGVsKSB7XG4gICAgICAkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gSGlkZSBhbGwgYWN0aXZlIGVsZW1lbnRzXG4gICAgICAgIHZhciAkYWxsVGFicyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzIHVsIGxpJyksIDApO1xuICAgICAgICAkYWxsVGFicy5mb3JFYWNoKGZ1bmN0aW9uICgkdGFiKSB7XG4gICAgICAgICAgJHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyICRhcGlEb2NDb250ZW50ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFwaS1kb2MuY29udGVudCcpLCAwKTtcbiAgICAgICAgJGFwaURvY0NvbnRlbnQuZm9yRWFjaChmdW5jdGlvbiAoJGRvY19jb250ZW50KSB7XG4gICAgICAgICAgJGRvY19jb250ZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWhpZGRlbicpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8vIEdldCB0aGUgdGFyZ2V0IGZyb20gdGhlIFwiZGF0YS10YXJnZXRcIiBhdHRyaWJ1dGVcbiAgICAgICAgdmFyIGFuY2hvciA9ICRlbC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgICAgIHZhciB0YXJnZXQgPSBhbmNob3IuZGF0YXNldC50YXJnZXQ7XG4gICAgICAgIHZhciAkdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTtcblxuICAgICAgICAvLyBUb2dnbGUgdGhlIGNsYXNzIG9uIGJvdGggdGhlIFwidGFicy1tZW51XCIgYW5kIHRoZSBcInRhYnMtY29udGVudFwiXG4gICAgICAgICRlbC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgJHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1oaWRkZW4nKTtcblxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXNzZXRzL2phdmFzY3JpcHRzL3RhYnNfbWVudS5qcyIsImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgLy8gR2V0IGFsbCBcImFuY2hvclwiIGVsZW1lbnRzIHN0YXJ0aW5nIGF0ICNcbiAgdmFyICRhbmNob3JzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXj1cIiNcIl0nKSwgMCk7XG5cbiAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBhbmNob3Igc3RhcnRpbmcgYXQgI1xuICBpZiAoJGFuY2hvcnMubGVuZ3RoID4gMCkge1xuXG4gICAgLy8gQWRkIGEgY2xpY2sgZXZlbnQgb24gZWFjaCBvZiB0aGVtXG4gICAgJGFuY2hvcnMuZm9yRWFjaChmdW5jdGlvbiAoJGVsKSB7XG4gICAgICAkZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgbG9jYXRpb24uaGFzaCA9ICRlbC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hc3NldHMvamF2YXNjcmlwdHMvc2Nyb2xsX3RvX2FuY2hvci5qcyJdLCJzb3VyY2VSb290IjoiIn0=