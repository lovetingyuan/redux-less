import { ASYNC_ACTION_TYPE } from './constants';

function warning() {
  throw new Error('you have to apply reduxLessMiddleware when you create the store');
}

export let dispatch = warning; // eslint-disable-line import/no-mutable-exports
export let getState = warning; // eslint-disable-line import/no-mutable-exports

/**
 * to listen actions, with action as param
 * @param {function} listener action listener
 */
export function reduxLessMiddlewareWithListener(listener = () => true) {
  return ({ dispatch: a, getState: b }) => {
    dispatch = a;
    getState = b;
    return next => (action) => {
      if (action && action.type !== ASYNC_ACTION_TYPE.type) {
        if (listener(action) !== false) {
          return next(action);
        }
      }
    };
  };
}

const reduxLessMiddleware = reduxLessMiddlewareWithListener();
export default reduxLessMiddleware;
