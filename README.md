## redux-less
write a redux reducer with less code, inspired by [mirror](https://github.com/mirrorjs/mirror)

### install
`npm install redux-less`

### example [online](https://jsfiddle.net/tingyuan/q0ehjo2r/)

```javascript
import { getReducer, reduxLessMiddleware } from 'redux-less';
import { applyMiddleware, createStore } from 'redux'
const store = createStore(
  rootReducer,
  initialState,
  // you must apply "reduxLessMiddleware" to your store
  applyMiddleware(reduxLessMiddleware, ...otherMiddlewares),
)
// ...
// you can use "store.replaceReducer" and "combineReducers" to apply this reducer
const reducer = getReducer({
  key: 'todo',
  initialState: [],
  getTodoList(dispatch, getState, args) { // async reducer can not omit "args" param
    fetch('./api/todos')
      .then(res => res.json())
      .then(list => {
        dispatch(getState().concat(list)) // dispatch the new state
      })
  },
  addTodo(state, action) { // pure function as sync reducer, owns two params
    return state.concat(action.payload) // return the new state
  },
  removeTodo(state, action) {
    const todos = state.slice()
    todos.splice(action.payload, 1)
    return todos
  },
})

// for react-redux, binding to container
export default connect(state => ({
  todoList: state[reducer.key], // reducer.key == "todo"
}), () => reducer.actions)(props => { // reducer.actions is an actionCreators map
  return (
    <div>
      {/* ... */}
      <button onClick={() => props.addTodo('new item')}>add</button>
    </div>
  )
})

```

### API

```javascript
import { 
  getReducer, 
  reduxLessMiddleware, 
  getActionType, 
  reduxLessMiddlewareWithListener 
} from 'redux-less'
// or you can use is as below when using an umd version
const getReducer = ReduxLess.getReducer
```

* `getReducer(model: object): function`

  get the reducer function, you can see the example above, it is quite clear
  the model contains `key` as the reducer key and `initialState` as the `state[key]` initial value
  other properties in model must be reducer function
* `reduxLessMiddleware`

  you must apply "reduxLessMiddleware" to your store
* `reduxLessMiddlewareWithListener(listener: function)`

  if you want to listen any action, you can call this api   
  listener is a function with the action as param    
  if listener returns false, then the action will not be dispatched    
```javascript
  applyMiddleware(reduxLessMiddlewareWithListener(action => {
    // action is Flux Standard Action, https://github.com/acdlite/flux-standard-action
  }))
```

* `getActionType(reducerKey: string, reducerName: string): string`

  get the action.type by reducer key and reducer function name
```javascript
  reduxLessMiddlewareWithListener(action => {
    if (getActionType('todo', 'addItem') === action.type) {
      if (!action.payload) return false
    }
  })
```  

### license
MIT
