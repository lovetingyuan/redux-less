import isPlainObject from 'lodash/isPlainObject';
import { dispatch, getState } from './middleware';
import { SPLIT, ASYNC_ACTION_TYPE } from './constants';

const logError = (typeof console === 'object' && process.env.NODE_ENV !== 'test')
  ? console.error // eslint-disable-line no-console
  : () => {};

/**
 * check the validation of reducer model
 * @param {object} model reducer config
 * @return {object} the checked model
 */
function checkModel(model) {
  if (!isPlainObject(model)) {
    const error = new Error(`model ${model} is not a plain object`);
    logError(error);
    throw error;
  }
  const key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(SPLIT) !== -1) {
    const error = new Error(`state key:"${key}" must be a string and can not contain "${SPLIT}"`);
    logError(error);
    throw error;
  }
  const _model = {
    initialState: model.initialState,
    key,
    reducers: {}
  };
  const reducersName = Object.keys(model);
  for (let i = 0; i < reducersName.length; i++) {
    const name = reducersName[i];
    // eslint-disable-next-line no-continue
    if (name === 'key' || name === 'initialState') continue;
    const reducer = model[name];
    if (typeof reducer !== 'function') {
      const error = new Error(`reducer "${name}" at "${model.key}" model must be a function`);
      logError(error);
      throw error;
    }
    if (name.indexOf(SPLIT) !== -1) {
      const error = new Error(`reducer "${name}" at "${model.key}" can not contain "${SPLIT}"`);
      logError(error);
      throw error;
    }
    _model.reducers[name] = reducer;
  }
  return _model;
}

/**
 * get action type by reducer key and reducer function name
 * @param {string} stateKey is also reducer key
 * @param {string} actionName is also reducer name
 * @return {string} the action type
 */
export function getActionType(stateKey, actionName) {
  if (!stateKey || typeof stateKey !== 'string') {
    const error = new Error('you must specify the reducer key');
    logError(error);
    throw error;
  }
  if (!actionName || typeof stateKey !== 'string') {
    return _actionName => stateKey + SPLIT + _actionName;
  }
  return stateKey + SPLIT + actionName;
}

/**
 * get reducer function for a container component
 * @param {object} model
 * @return {function} the reducer function
 */
export default function getReducer(model) {
  const { key: stateKey, initialState, reducers } = checkModel(model);
  const actions = {};
  const _getState = (key = stateKey) => getState()[key];
  Object.keys(reducers).forEach((actionName) => {
    const type = getActionType(stateKey, actionName);
    const actionDispatcher = (payload, error, meta) => dispatch({ type, payload, error, meta });
    if (model[actionName].length <= 2) {
      // support Flux Standard Action
      actions[actionName] = actionDispatcher;
    } else {
      actions[actionName] = (...args) => {
        model[actionName].call(model, actionDispatcher, _getState, args);
        return ASYNC_ACTION_TYPE;
      };
    }
  });
  function reducer(state = initialState, action) {
    const handlerName = action.type.split(SPLIT)[1];
    if (!(handlerName in model)) return state;
    const reducerFunc = model[handlerName];
    if (reducerFunc.length > 2) return action.payload;
    return reducerFunc(state, action);
  }
  reducer.key = stateKey;
  reducer.actions = actions;
  return reducer;
}
