'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = exports.dispatch = undefined;
exports.default = reduxLessMiddleware;

var _constants = require('./constants');

function warning() {
  throw new Error('you have to apply middleware when you create the store');
}

var dispatch = exports.dispatch = warning; // eslint-disable-line import/no-mutable-exports
var getState = exports.getState = warning; // eslint-disable-line import/no-mutable-exports

function reduxLessMiddleware(_ref) {
  var a = _ref.dispatch,
      b = _ref.getState;

  exports.dispatch = dispatch = a;
  exports.getState = getState = b;
  return function (next) {
    return function (action) {
      if (action && action.type !== _constants.ASYNC_ACTION_TYPE) {
        return next(action);
      }
    };
  };
}