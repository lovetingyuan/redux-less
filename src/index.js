import { bindActionCreators } from 'redux'
import checkModel from './checkModel'


const SPLIT = '/'

function effect(target) {
  if (target) target.__async = true
  return target
}

function getReducer(_model) {
  const model = checkModel(_model)
  if (model instanceof Error) {
    throw model
  }
  const actions = {}
  for (let actionName in model) {
    const type = model.key + SPLIT + actionName
    const reducer = model[actionName]
    if (reducer.length <= 2) {
      actions[actionName] = payload => ({ type, payload })
    } else {
      // support redux-thunk
      actions[actionName] = (...args) => (dispatch, getState, extraArgument) => {
        if (typeof reducer === 'object') {
          return reducer.action(...args)
        }
        model[actionName] = reducer(
          // support Flux Standard Action
          (payload, error, meta) => dispatch({ type, payload, error, meta }),
          (key = model.key) => getState()[key],
          extraArgument
        )
        const { action, reducer: _reducer } = model[actionName]
        if (typeof action !== 'function' || typeof _reducer !== 'function') {
          const msg =
            `the reducer ${actionName} at ${model.key} must return an object with "action" and "reducer" function`
          throw new Error(msg)
        }
        return action(...args) // action contains async code
      }
    }
  }
  function reducer(state = model.initialState, action) {
    const handlerName = action.type.split(SPLIT)[1]
    if (!(handlerName in model)) return state
    let reducerFunc = model[handlerName]
    if (typeof reducerFunc === 'object') {
      reducerFunc = reducerFunc.reducer
    }
    return reducerFunc(state, action)
  }
  reducer.key = model.key
  reducer.actions = actions
  ACTIONS[reducer.key] = bindActionCreators(actions, _dispatch)
  ACTIONS[reducer.key]['__model'] = model

  return reducer
}

export {
  ACTIONS as actions,
  getReducer as default,
  reduxLessMiddleware,
  effect,
}
