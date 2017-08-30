'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPlainObject = require('lodash-es/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _middleware = require('./middleware');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkModel(model) {
  if (!(0, _isPlainObject2.default)(model)) throw new Error('model ' + model + ' is not a plain object');
  var key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(_constants.SPLIT) !== -1) {
    throw new Error('state key:"' + key + '" must a string and can not contain "' + _constants.SPLIT + '"');
  }
  var _model = {
    initialState: model.initialState,
    key: key,
    reducers: {}
  };
  var reducersName = Object.keys(model).filter(function (v) {
    return v !== 'initialState' && v !== 'key';
  });
  for (var i = 0; i < reducersName.length; i++) {
    var name = reducersName[i];
    var reducer = model[name];
    if (typeof reducer !== 'function') {
      throw new Error('reducer "' + name + '" at "' + model.key + '" model must be a function');
    }
    if (name.indexOf(_constants.SPLIT) !== -1) {
      throw new Error('reducer "' + name + '" at "' + model.key + '" can not contain "' + _constants.SPLIT + '"');
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
    var type = stateKey + _constants.SPLIT + actionName;
    if (model[actionName].length <= 2) {
      // support Flux Standard Action
      actions[actionName] = function (payload, error, meta) {
        return { type: type, payload: payload, error: error, meta: meta };
      };
    } else {
      actions[actionName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        model[actionName](function (payload, error, meta) {
          return (0, _middleware.dispatch)({ type: type, payload: payload, error: error, meta: meta });
        }, function () {
          var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stateKey;
          return (0, _middleware.getState)()[key];
        }, args);
        return { type: _constants.ASYNC_ACTION_TYPE };
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