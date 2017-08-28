import { bindActionCreators } from 'redux'
import checkModel, { SPLIT } from './checkModel'


function effect(target) {
  if (target) target.__async = true
  return target
}

function getReducer(model) {
  const { key: stateKey, initialState, reducers } = checkModel(model)
  const actions = {}
  for (let actionName in reducers) {
    const type = stateKey + SPLIT + actionName
    const reducer = model[actionName]
    if (reducer.length <= 2) {
      actions[actionName] = payload => ({ type, payload })
    } else {
      // support redux-thunk
      actions[actionName] = (...args) => (dispatch, getState) => {
        reducer(
          // support Flux Standard Action
          (payload, error, meta) => dispatch({ type, payload, error, meta }),
          (key = stateKey) => getState()[key],
          args
        )
      }
    }
  }
  function reducer(state = initialState, action) {
    const handlerName = action.type.split(SPLIT)[1]
    if (!(handlerName in model)) return state
    let reducerFunc = model[handlerName]
    if (reducerFunc.length > 2) return action.payload
    return reducerFunc(state, action)
  }
  reducer.key = stateKey
  reducer.actions = actions
  ACTIONS[stateKey] = bindActionCreators(actions, _dispatch)
  return reducer
}

export {
  getReducer as default,
  effect,
}
