## redux-less

write a redux reducer with less code, inspired by [mirror](https://github.com/mirrorjs/mirror)

### example

```javascript
import getReducer from 'redux-less'

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
  todoList: state[reducer.key] // reducer.key == "todo"
}), reducer.actions)(props => { // reducer.actions is an actionCreators map
  return ( 
    <div> 
      {/* ... */}
      <button onClick={() => props.addTodo('new item')}>add</button>
    </div>
  )
})

```

### license
MIT