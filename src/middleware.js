import { ASYNC_ACTION_TYPE } from './constants';

function warning() {
  throw new Error('you have to apply middleware when you create the store');
}

export let dispatch = warning; // eslint-disable-line import/no-mutable-exports
export let getState = warning; // eslint-disable-line import/no-mutable-exports

export function reduxLessMiddlewareWithListener(listener) {
  const hasListener = typeof listener === 'function';
  return ({ dispatch: a, getState: b }) => {
    dispatch = a;
    getState = b;
    return next => (action) => {
      if (action && action.type !== ASYNC_ACTION_TYPE.type) {
        if (hasListener) {
          const ret = listener(action);
          if (ret !== false) {
            return next(action);
          }
        } else {
          return next(action);
        }
      }
    };
  };
}

const reduxLessMiddleware = reduxLessMiddlewareWithListener();
export default reduxLessMiddleware;
