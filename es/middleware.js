import { ASYNC_ACTION_TYPE } from './constants';

function warning() {
  throw new Error('you have to apply middleware when you create the store');
}

export var dispatch = warning; // eslint-disable-line import/no-mutable-exports
export var getState = warning; // eslint-disable-line import/no-mutable-exports

export function reduxLessMiddlewareWithListener() {
  var listener = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return true;
  };

  return function (_ref) {
    var a = _ref.dispatch,
        b = _ref.getState;

    dispatch = a;
    getState = b;
    return function (next) {
      return function (action) {
        if (action && action.type !== ASYNC_ACTION_TYPE.type) {
          if (listener(action) !== false) {
            return next(action);
          }
        }
      };
    };
  };
}

var reduxLessMiddleware = reduxLessMiddlewareWithListener();
export default reduxLessMiddleware;