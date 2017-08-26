import { bindActionCreators } from 'redux'

const ACTIONS = Object.create(null)

const SPLIT = ' ^_^ '

let _dispatch = () => {
  throw new Error('you have to apply middleware when you create the store')
}

const exportDispatchMiddleware = ({ dispatch, getState }) => {
  _dispatch = dispatch
  return next => action => {
    return next(action)
  }
}

function getReducer(config) {
  const actions = {}

  for (let actionName in config) {
    if (actionName === 'key' || actionName === 'initialState') continue
    const type = config.key + SPLIT + actionName
    const reducer = config[actionName]
    if (typeof reducer === 'function' && reducer.length <= 2) {
      actions[actionName] = payload => ({ type, payload })
    } else {
      // support redux-thunk
      actions[actionName] = (...args) => (dispatch, getState, extraArgument) => {
        if (typeof reducer === 'object') {
          return reducer.action(...args)
        }
        config[actionName] = reducer(
          // support Flux Standard Action
          (payload, error, meta) => dispatch({ type, payload, error, meta }),
          (key = config.key) => getState()[key],
          extraArgument
        )
        return config[actionName].action(...args) // action contains async code
      }
    }
  }
  function reducer(state = config.initialState, action) {
    const handlerName = action.type.split(SPLIT)[1]
    if (!(handlerName in config)) return state
    let reducerFunc = config[handlerName]
    if (typeof reducerFunc === 'object') {
      reducerFunc = reducerFunc.reducer
    }
    return reducerFunc(state, action)
  }
  reducer.key = config.key
  reducer.actions = actions
  ACTIONS[reducer.key] = bindActionCreators(actions, _dispatch)
  return reducer
}

export {
  ACTIONS as actions,
  getReducer as default,
  exportDispatchMiddleware
}
