/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:25:23
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-11 19:07:29
 */
import React, {useState, useRef, useEffect} from 'react'
import './App.css'
let idSeq = Date.now()
function Control(props) {
  const { addTodo } = props
  const inputRef = useRef()
  const onSubmit = (e) => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) {
      return
    }
    addTodo({
      id: ++idSeq,
      text: newText,
      complete: false
    })
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
  }, toggleTodo, removeTodos} = props
  const onChange = () => {
    toggleTodo(id)
  }
  const onRemove = () => {
    removeTodos(id)
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
  const {todos, toggleTodo, removeTodos} = props
  return (
    <ul>
      {
        todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              removeTodos={removeTodos}
            />
          )
        })
      }
    </ul>
  )
}

const LS_KEY = 'todo'

function TodoList() {
  const [todos, setTodos] = useState([])
  const addTodo = (todo) => {
    setTodos(todos => [...todos, todo])
  }
  const removeTodos = (id) => {
    setTodos(todos => todos.filter(todo => {
      return todo.id !== id
    }))
  }
  const toggleTodo = (id) => {
    setTodos(todos => todos.map(todo => {
      return todo.id === id ? {
        ...todo,
        complete: !todo.complete
      }:todo
    }))
  }
  // 注意hooks函数是有顺序的
  // 程序初始化调用，只执行一次
  useEffect(() => {
    const todo = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    console.log(todo, 'todoGet')
    setTodos(todo)
  }, [])
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
    console.log(todos, 'todoSet')
  }, [todos])
  return (
    <div className="todo-list">
      <Control addTodo={addTodo}></Control>
      <Todos removeTodos={removeTodos} toggleTodo={toggleTodo} todos={todos}></Todos>
    </div>
  )
}
export default TodoList