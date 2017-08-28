let _dispatch = () => {
  throw new Error('you have to apply middleware when you create the store')
}
let _getState = () => {
  throw new Error('you have to apply middleware when you create the store')
}

const reduxLessMiddleware = ({ dispatch, getState }) => {
  _dispatch = dispatch
  _getState = getState
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action)
  }
}
export function getDispatch() {
  return {
    dispath: _dispatch,
    getState: _getState
  }
}
export default reduxLessMiddleware
