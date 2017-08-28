import isPlainObject from 'lodash-es/isPlainObject'
import assign from 'lodash-es/assign'

function checkModel(model) {
  if (!isPlainObject(model)) return new Error(`model ${model} is not a plain object`)
  const _model = assign({}, model)
  const { key } = _model
  if (!key || typeof key !== 'string') {
    return new Error(`key ${key} in model ${model} must be a valid string`)
  }
  if (key.indexOf(SPLIT) >= 0) {
    return new Error(`key ${key} in model ${model} can not contain '/' character`)
  }
  for (let reducerName in _model) {
    if (_model.hasOwnProperty(reducerName) &&
      reducerName !== 'key' &&
      reducerName !== 'initialState'
    ) {
      const reducer = _model[reducerName]
      if (typeof reducer !== 'function') {
        return new Error(`reducer ${reducerName} in model ${model} must be a function`)
      }
      if (reducer.length !== 2 || reducer.length !== 3) {
        return new Error(`reducer ${reducerName} in model ${model} must have 2 or 3 args`)
      }
    }
  }
  return _model
}

export default checkModel
