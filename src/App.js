/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:25:23
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 12:43:22
 */
import React, {useState, useRef, useEffect} from 'react'
import {
  createAdd,
  createRemove,
  createSet,
  createToggle
} from './actionCreators'
import reducer from './reducer'
import './App.css'
// 封装一个函数用来分发action。
function bindActionCreators(actionCreators, dispatch) {
  const ret = {}
  for(let key in actionCreators) {
    ret[key] = function(...args) {
      const actionCreator = actionCreators[key]
      const action = actionCreator(...args)
      dispatch(action)
    }
  }
  return ret
}

function Control(props) {
  const { addTodo } = props
  const inputRef = useRef()
  const onSubmit = (e) => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) {
      return
    }
    // addTodo({
    //   id: ++idSeq,
    //   text: newText,
    //   complete: false
    // })
    addTodo(newText)
    inputRef.current.value = ''
  }
  return (
    <div className="control">
      <h1>
        todos
      </h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          ref={inputRef}
          className="new-todo"
          placeholder="what needs to be done?"
        />
      </form>
    </div>
  )
}

function TodoItem(props) {
  const {todo: {
    id,
    text,
    complete
  }, dispatch} = props
  const onChange = () => {
    dispatch(createToggle(id))
  }
  const onRemove = () => {
    dispatch(createRemove(id))
  }
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        onChange={onChange}
        checked={complete}
      />
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  )
}


function Todos(props) {
  const {todos, dispatch} = props
  return (
    <ul>
      {
        todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              dispatch={dispatch}
            />
          )
        })
      }
    </ul>
  )
}

const LS_KEY = 'todo'
let store = {
  todos: [],
  incrementCount: 0
}
function TodoList() {
  const [todos, setTodos] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)
  useEffect(() => {
    Object.assign(store, {
      todos,
      incrementCount
    })
  }, [todos, incrementCount])
  // 使用dispatch以及action管理数据
  const dispatch = (action) => {
    const setters = {
      todos: setTodos,
      incrementCount: setIncrementCount
    }
    if('function' === typeof action) {
      action(dispatch, () => store)
      return
    }
    const newState = reducer(store, action)
    for(let key in newState) {
      setters[key](newState[key])
    }
  }

  // 注意hooks函数是有顺序的
  // 程序初始化调用，只执行一次
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    console.log(todos, 'todoGet')
    // setTodos(todos)
    dispatch(createSet(todos))
  }, [])
  // 只要todos变化就执行，监听todos
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
    console.log(todos, 'todoSet')
  }, [todos])

  return (
    <div className="todo-list">
      <Control 
        {
          ...bindActionCreators({
            addTodo: createAdd
          }, dispatch)
        }
      ></Control>
      <Todos
      // {
      //   ...bindActionCreators({
      //     removeTodo: createRemove,
      //     toggleTodo: createToggle
      //   }, dispatch)
      // }
      dispatch={dispatch} todos={todos}></Todos>
    </div>
  )
}
export default TodoList