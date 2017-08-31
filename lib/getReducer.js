'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isPlainObject = require('lodash-es/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _filter = require('lodash-es/filter');

var _filter2 = _interopRequireDefault(_filter);

var _middleware = require('./middleware');

var _constants = require('./constants');

var _action = require('./action');

var _action2 = _interopRequireDefault(_action);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-console
var logError = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' ? console.error : function () {};

function checkModel(model) {
  if (!(0, _isPlainObject2.default)(model)) {
    var error = new Error('model ' + model + ' is not a plain object');
    logError(error);
    throw error;
  }
  var key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(_constants.SPLIT) !== -1) {
    var _error = new Error('state key:"' + key + '" must be a string and can not contain "' + _constants.SPLIT + '"');
    logError(_error); // eslint-disable-line no-console
    throw _error;
  }
  var _model = {
    initialState: model.initialState,
    key: key,
    reducers: {}
  };
  var reducersName = (0, _filter2.default)(Object.keys(model), function (v) {
    return v !== 'initialState' && v !== 'key';
  });
  for (var i = 0; i < reducersName.length; i++) {
    var name = reducersName[i];
    var reducer = model[name];
    if (typeof reducer !== 'function') {
      var _error2 = new Error('reducer "' + name + '" at "' + model.key + '" model must be a function');
      logError(_error2); // eslint-disable-line no-console
      throw _error2;
    }
    if (name.indexOf(_constants.SPLIT) !== -1) {
      var _error3 = new Error('reducer "' + name + '" at "' + model.key + '" can not contain "' + _constants.SPLIT + '"');
      logError(_error3); // eslint-disable-line no-console
      throw _error3;
    }
    _model.reducers[name] = reducer;
  }
  return _model;
}

function getReducer(model) {
  var _checkModel = checkModel(model),
      stateKey = _checkModel.key,
      initialState = _checkModel.initialState,
      reducers = _checkModel.reducers;

  var actions = {};
  Object.keys(reducers).forEach(function (actionName) {
    if (model[actionName].length <= 2) {
      // support Flux Standard Action
      actions[actionName] = function (payload, error, meta) {
        var action = new _action2.default(stateKey, actionName, payload, error, meta);
        return (0, _middleware.dispatch)(action);
      };
    } else {
      actions[actionName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        model[actionName](function (payload, error, meta) {
          var action = new _action2.default(stateKey, actionName, payload, error, meta);
          return (0, _middleware.dispatch)(action);
        }, function () {
          var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stateKey;
          return (0, _middleware.getState)()[key];
        }, args);
        return _constants.ASYNC_ACTION_TYPE;
      };
    }
  });
  function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var handlerName = action.type.split(_constants.SPLIT)[1];
    if (!(handlerName in model)) return state;
    var reducerFunc = model[handlerName];
    if (reducerFunc.length > 2) return action.payload;
    return reducerFunc(state, action);
  }
  reducer.key = stateKey;
  reducer.actions = actions;
  return reducer;
}

exports.default = getReducer;