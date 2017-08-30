'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getReducer = require('./getReducer');

var _getReducer2 = _interopRequireDefault(_getReducer);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  reduxLessMiddleware: _middleware2.default,
  getReducer: _getReducer2.default
};