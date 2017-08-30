import { ASYNC_ACTION_TYPE } from './constants';

function warning() {
  throw new Error('you have to apply middleware when you create the store');
}

export var dispatch = warning; // eslint-disable-line import/no-mutable-exports
export var getState = warning; // eslint-disable-line import/no-mutable-exports

export default function reduxLessMiddleware(_ref) {
  var a = _ref.dispatch,
      b = _ref.getState;

  dispatch = a;
  getState = b;
  return function (next) {
    return function (action) {
      if (action && action.type !== ASYNC_ACTION_TYPE) {
        return next(action);
      }
    };
  };
}