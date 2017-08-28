import isPlainObject from 'lodash-es/isPlainObject'
import assign from 'lodash-es/assign'

const SPLIT = '/'

function checkModel(model) {
  if (!isPlainObject(model)) throw new Error(`model ${model} is not a plain object`)
  const key = model.key
  if (!key || typeof key !== 'string' || key.indexOf(SPLIT) !== -1) {
    throw new Error(`state key:"${key}" must a string and can not contain "${SPLIT}"`)
  }
  const _model = {
    initialState: model.initialState,
    key,
    reducers: {}
  }
  for (let name in model) {
    if (model.hasOwnProperty(name) &&
      name !== 'initialState' &&
      name !== 'key'
    ) {
      const reducer = model[name]
      if (typeof reducer !== 'function') {
        throw new Error(`reducer "${name}" at "${model.key}" model must be a function`)
      }
      if (name.indexOf(SPLIT) !== -1) {
        throw new Error(`reducer "${name}" at "${model.key}" can not contain "${SPLIT}"`)
      }
      _model.reducers[name] = reducer
    }
  }
  return _model
}

export { SPLIT }
export default checkModel
