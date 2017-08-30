import isPlainObject from 'lodash-es/isPlainObject';
import { dispatch, getState } from './middleware';

import { SPLIT, ASYNC_ACTION_TYPE } from './constants';

function checkModel(model) {
  if (!isPlainObject(model)) throw new Error('model ' + model + ' is not a plain object');
  var key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(SPLIT) !== -1) {
    throw new Error('state key:"' + key + '" must a string and can not contain "' + SPLIT + '"');
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
    if (name.indexOf(SPLIT) !== -1) {
      throw new Error('reducer "' + name + '" at "' + model.key + '" can not contain "' + SPLIT + '"');
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
    var type = stateKey + SPLIT + actionName;
    if (model[actionName].length <= 2) {
      actions[actionName] = function (payload) {
        return { type: type, payload: payload };
      };
    } else {
      actions[actionName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        model[actionName](
        // support Flux Standard Action
        function (payload, error, meta) {
          return dispatch({ type: type, payload: payload, error: error, meta: meta });
        }, function () {
          var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : stateKey;
          return getState()[key];
        }, args);
        return { type: ASYNC_ACTION_TYPE };
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