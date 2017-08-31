import isPlainObject from 'lodash-es/isPlainObject';
import filter from 'lodash-es/filter';
import { dispatch, getState } from './middleware';
import { SPLIT, ASYNC_ACTION_TYPE } from './constants';
import Action from './action';

// eslint-disable-next-line no-console
const logError = typeof console === 'object' ? console.error : () => {};

function checkModel(model) {
  if (!isPlainObject(model)) {
    const error = new Error(`model ${model} is not a plain object`);
    logError(error);
    throw error;
  }
  const key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(SPLIT) !== -1) {
    const error = new Error(`state key:"${key}" must be a string and can not contain "${SPLIT}"`);
    logError(error); // eslint-disable-line no-console
    throw error;
  }
  const _model = {
    initialState: model.initialState,
    key,
    reducers: {}
  };
  const reducersName = filter(Object.keys(model), v => v !== 'initialState' && v !== 'key');
  for (let i = 0; i < reducersName.length; i++) {
    const name = reducersName[i];
    const reducer = model[name];
    if (typeof reducer !== 'function') {
      const error = new Error(`reducer "${name}" at "${model.key}" model must be a function`);
      logError(error); // eslint-disable-line no-console
      throw error;
    }
    if (name.indexOf(SPLIT) !== -1) {
      const error = new Error(`reducer "${name}" at "${model.key}" can not contain "${SPLIT}"`);
      logError(error); // eslint-disable-line no-console
      throw error;
    }
    _model.reducers[name] = reducer;
  }
  return _model;
}

function getReducer(model) {
  const { key: stateKey, initialState, reducers } = checkModel(model);
  const actions = {};
  Object.keys(reducers).forEach((actionName) => {
    if (model[actionName].length <= 2) {
      // support Flux Standard Action
      actions[actionName] = (payload, error, meta) => {
        const action = new Action(stateKey, actionName, payload, error, meta);
        return dispatch(action);
      };
    } else {
      actions[actionName] = (...args) => {
        model[actionName](
          (payload, error, meta) => {
            const action = new Action(stateKey, actionName, payload, error, meta);
            return dispatch(action);
          },
          (key = stateKey) => getState()[key],
          args
        );
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

export default getReducer;
