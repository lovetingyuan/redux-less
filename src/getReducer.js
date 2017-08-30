import isPlainObject from 'lodash-es/isPlainObject';
import { dispatch, getState } from './middleware';

import { SPLIT, ASYNC_ACTION_TYPE } from './constants';

function checkModel(model) {
  if (!isPlainObject(model)) throw new Error(`model ${model} is not a plain object`);
  const key = model.key;
  if (!key || typeof key !== 'string' || key.indexOf(SPLIT) !== -1) {
    throw new Error(`state key:"${key}" must a string and can not contain "${SPLIT}"`);
  }
  const _model = {
    initialState: model.initialState,
    key,
    reducers: {}
  };
  const reducersName = Object.keys(model).filter(v => v !== 'initialState' && v !== 'key');
  for (let i = 0; i < reducersName.length; i++) {
    const name = reducersName[i];
    const reducer = model[name];
    if (typeof reducer !== 'function') {
      throw new Error(`reducer "${name}" at "${model.key}" model must be a function`);
    }
    if (name.indexOf(SPLIT) !== -1) {
      throw new Error(`reducer "${name}" at "${model.key}" can not contain "${SPLIT}"`);
    }
    _model.reducers[name] = reducer;
  }
  return _model;
}

function getReducer(model) {
  const { key: stateKey, initialState, reducers } = checkModel(model);
  const actions = {};
  Object.keys(reducers).forEach((actionName) => {
    const type = stateKey + SPLIT + actionName;
    if (model[actionName].length <= 2) {
      // support Flux Standard Action
      actions[actionName] = (payload, error, meta) => ({ type, payload, error, meta });
    } else {
      actions[actionName] = (...args) => {
        model[actionName](
          (payload, error, meta) => dispatch({ type, payload, error, meta }),
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
