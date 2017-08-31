var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import isPlainObject from 'lodash-es/isPlainObject';
import filter from 'lodash-es/filter';
import { dispatch, getState } from './middleware';
import { SPLIT, ASYNC_ACTION_TYPE } from './constants';
import Action from './action';

// eslint-disable-next-line no-console
var logError = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' ? console.error : function () {};

function checkModel(model) {
  if (!isPlainObject(model)) {
    var error = new Error('model ' + model + ' is not a plain object');
    logError(error);
    throw error;
  }
  var key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(SPLIT) !== -1) {
    var _error = new Error('state key:"' + key + '" must be a string and can not contain "' + SPLIT + '"');
    logError(_error); // eslint-disable-line no-console
    throw _error;
  }
  var _model = {
    initialState: model.initialState,
    key: key,
    reducers: {}
  };
  var reducersName = filter(Object.keys(model), function (v) {
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
    if (name.indexOf(SPLIT) !== -1) {
      var _error3 = new Error('reducer "' + name + '" at "' + model.key + '" can not contain "' + SPLIT + '"');
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
        var action = new Action(stateKey, actionName, payload, error, meta);
        return dispatch(action);
      };
    } else {
      actions[actionName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        model[actionName](function (payload, error, meta) {
          var action = new Action(stateKey, actionName, payload, error, meta);
          return dispatch(action);
        }, function () {
          var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stateKey;
          return getState()[key];
        }, args);
        return ASYNC_ACTION_TYPE;
      };
    }
  });
  function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var handlerName = action.type.split(SPLIT)[1];
    if (!(handlerName in model)) return state;
    var reducerFunc = model[handlerName];
    if (reducerFunc.length > 2) return action.payload;
    return reducerFunc(state, action);
  }
  reducer.key = stateKey;
  reducer.actions = actions;
  return reducer;
}

export default getReducer;