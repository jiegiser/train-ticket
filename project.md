<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:53:22
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 12:47:10
 -->

## react hooks

### 类组件不足

#### 状态逻辑复用难
- 缺少复用机制
- 渲染属性和高阶组件导致层级冗余
#### 状态逻辑复用难
- 缺少复用机制
- 渲染属性和高阶组件导致层级冗余
#### 趋向复杂难以维护
- 生命周期函数混杂不相干逻辑
- 相干逻辑分散在不同生命周期
#### this指向
- 内联函数过度创建新句柄
- 类成员函数不能保证this

### Hooks优势

#### 优化类组件的三大问题
- 函数组件无this问题（不牵扯实例化）
- 自定义Hooks方便复用状态逻辑（自定义hooks可以使用hooks相关api）
- 副作用的关注点分离

### hooks 常见的问题
#### 对传统react编程的影响
- 声明周期函数如何映射到hooks？
```js
function App() {
  useEffect(() => {
    //componentDidMount
    return () => {
      // componentWillMount
    }
  }, [])
  let renderCounter = useRef(0)
  renderCounter.current++

  useEffect(() => {
    if (renderCounter > 1) {
      // componentDidUpdate
    }
  })
}

```
- 类实例成员变量如何映射到hooks上？
```js
class App() {
  it = 0
}
function App() {
  // useRef也可以传入一个初始值参数
  const it = useRef(0)
}
```
- Hooks中如何获取历史props和state
```js
function Counter() {
  const [count, setCount] = useState(0)
  // 通过ref来保存上一次的count的值
  const prevCountRef = useRef()
  useEffect(() => {
    prevCountRef.current = count
  })
  const prevCount = prevCountRef.current
  return <h1></h1>
}
```
- 如何强制更新一个hooks组件
```js
function Counter() {
  const [updater, setUpdater] = useState(0)
  // 组件内部更新数值，会间接更新组件
  function forceUpdate() {
    setUpdater(updater => updater + 1)
  }
  return <h1></h1>
}
```

### useState
他接收的可以是一个设置的初始值，也可以是一个回调函数,回调函数会延迟赋值：
```js
const [count, setCount] = useState(() => {
  return 0
})
```
然后setCount也可以接收一个函数，不过一般建议写函数：
```js
setCount(x => x + 1)
```
> useState是根据程序第一次运行的顺序返回对应的state。如果每次顺序不一致返回的结果也是混乱的。useState在初始化的时候就确定了返回值；
可以使用eslint-plugin-react-hooks插件进行帮助我们对useState的使用规范。
在package.json中进行配置：
```js
  "eslintConfig": {
    "extends": "react-app",
    "plugins": [
      "react-hooks"
    ],
    "rules": {
      "react-hooks/rules-of-hooks": "error"
    }
  },
```
### useEffect
这个api相当于react几乎所有的的声明周期函数。根据[]里面的参数，如果里面的参数改变了，useEffect就会执行。
如果没有第二个参数，加入useEffect里面的数值发送改变就会执行
```js
useEffect(() => {
  // 如果没有第二个参数，这里的代码只执行一次，相当于moubted vue的。
  return () => {
    // 这里面只有组件注销的时候才会执行。。
  }
}, [])
useEffect(() => {
  document.querySelector('#size').addEventListener('click', onClick, false)
  return () => {
    // 如果我们获取的dom元素每次会发生改变，会在不同的dom元素上绑定事件，需要在这里进行解绑，这样保证每次绑定的值是正确的。
    document.querySelector('#size').removeEventListener('click', onClick, false)
  }
})
```

### useRef

- 获取子组件或者DOM节点的句柄
- 渲染周期之间共享数据的存储

用法：
```js
const ref = props => {
	const ref = useRef()
	useEffect(() => {
	  ref.current.value = props.value
	})
	return <input ref ={ ref } />
}
```
其他应用场景：调用子组件的方法
```js
import React, {useState, useMemo, useRef, useCallback} from 'react'
import './App.css'
class Counter extends React.Component {
  speak() {
    console.log(`now counter is: ${this.props.count}`)
  }
  render() {
    return <h1 onClick={this.props.onClick}>{this.props.count}</h1>
  }
}
function App() {
  const counterRef = useRef()
  const [count, setCount] = useState(0)
  const double = useMemo(() => {
    return count * 2
  }, [count === 3])
  const onClick = useCallback(() => {
    console.log('click')
    // 这里注意我们需要使用current属性来获取到值
    // 注意这里如果需要获取子组件的dom，子组件需要是类组件的声明格式
    console.log(counterRef.current)
    // 调用子组件的方法、
    counterRef.current.speak()
  }, [counterRef])
  return (
    <div>
       {count}---double： {double}
      <button onClick={() => {setCount(count + 1)}}>+</button>
        <Counter ref={counterRef} count={count} onClick={onClick}></Counter>
    </div>
  )
}
export default App
```
另一个应用场景：如果在组件中需要访问上一次渲染的数据甚至是state。可以使用useref进行保存
```js
import React, {useState, useMemo, useRef, useCallback, useEffect} from 'react'
import './App.css'
class Counter extends React.Component {
  speak() {
    console.log(`now counter is: ${this.props.count}`)
  }
  render() {
    return <h1 onClick={this.props.onClick}>{this.props.count}</h1>
  }
}
function App() {
  const counterRef = useRef()
  const [count, setCount] = useState(0)
  let it
  const double = useMemo(() => {
    return count * 2
  }, [count === 3])
  const onClick = useCallback(() => {
    console.log('click')
    // 这里注意我们需要使用current属性来获取到值
    // 注意这里如果需要获取子组件的dom，子组件需要是类组件的声明格式
    console.log(counterRef.current)
    // 调用子组件的方法、
    counterRef.current.speak()
  }, [counterRef])
  // 只执行一次
  useEffect(() => {
    setInterval(() => {
      it = setCount(count => count + 1)
    }, 1000)
  }, [])
  // 每次都执行
  useEffect(() => {
    if (count >= 10) {
      // 这里不能直接清除，因为每次函数进行渲染，it都是不一样的
      clearInterval(it)
    }
  })
  return (
    <div>
       {count}---double： {double}
      <button onClick={() => {setCount(count + 1)}}>+</button>
        <Counter ref={counterRef} count={count} onClick={onClick}></Counter>
    </div>
  )
}
export default App
```
修改后：
```js
import React, {useState, useMemo, useRef, useCallback, useEffect} from 'react'
import './App.css'
class Counter extends React.Component {
  speak() {
    console.log(`now counter is: ${this.props.count}`)
  }
  render() {
    return <h1 onClick={this.props.onClick}>{this.props.count}</h1>
  }
}
function App() {
  const counterRef = useRef()
  const [count, setCount] = useState(0)
  let it = useRef()
  const double = useMemo(() => {
    return count * 2
  }, [count === 3])
  const onClick = useCallback(() => {
    console.log('click')
    // 这里注意我们需要使用current属性来获取到值
    // 注意这里如果需要获取子组件的dom，子组件需要是类组件的声明格式
    console.log(counterRef.current)
    // 调用子组件的方法、
    counterRef.current.speak()
  }, [counterRef])
  // 只执行一次
  useEffect(() => {
    setInterval(() => {
      it.current = setCount(count => count + 1)
    }, 1000)
  }, [])
  // 每次都执行
  useEffect(() => {
    if (count >= 10) {
      // 这里不能直接清除，因为每次函数进行渲染，it都是不一样的
      clearInterval(it.current)
    }
  })
  return (
    <div>
       {count}---double： {double}
      <button onClick={() => {setCount(count + 1)}}>+</button>
        <Counter ref={counterRef} count={count} onClick={onClick}></Counter>
    </div>
  )
}
export default App
```

### useContext
跟之前Context的对比：
```js
import React, {useState, createContext, useContext } from 'react'
import './App.css'
const CountContext = createContext()
function Counter () {
  const count = useContext(CountContext)
  return <h1>{count}</h1>
}
function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
       {count}
      <button onClick={() => {setCount(count + 1)}}>+</button>
      <CountContext.Provider value={count}>
        <Counter></Counter>
      </CountContext.Provider>
    </div>
  )
}
export default App
```

### useMemo、useCallback

这两个API经常用来优化组件渲染，监听历来的值的变化，来决定是否重新对子组件渲染：
```js
import React, {useState, useMemo, useCallback} from 'react'
import './App.css'
function Counter (props) {
  return <h1 onClick={props.onClick}>{props.count}</h1>
}
function App() {
  const [count, setCount] = useState(0)
  // 第二个参数是依赖的变量组成的数组，如果第二个参数不传入，useMemo的逻辑每次都会运行
  // 如果传入空数组就只会运行一次, 他与useEffect区别就是，在useEffect之前运行；并且他可以返回jsx进行渲染页面
  // 只有count变化，double才会重新计算---类似vue的watch函数
  const double = useMemo(() => {
    return count * 2
  }, [count === 3])
  // useMemo可以依赖另一个memo
  const half = useMemo(() => {
    return double / 4
  }, [double])
  // const onClick = () => {
  //   console.log('Click')
  // }
  // 保证句柄一致，子元素点击时候，函数没有发生变化，子元素被渲染
  // const onClick = useMemo(() => {
  //   return () => {
  //     console.log('Click')
  //   }
  // }, [])
  // 上面的写法可以写成下面的：如果useMemo(() => fn) <===> useCallback(fn)
  const onClick = useCallback(() => {
    console.log('Click')
    // 第二个参数是useCallback依赖的两个变量
  }, [])
  return (
    <div>
       {count}---double： {double}
       half: {half}
      <button onClick={() => {setCount(count + 1)}}>+</button>
        <Counter count={count} onClick={onClick}></Counter>
    </div>
  )
}
export default App
```

### 自定义hooks
hooks可以返回jsx参与渲染：
```js
import React, {useState, useRef, useEffect} from 'react'
import './App.css'
function useCounter(count) {
  return <h1>{count}</h1>
}
function useCount(defaultCount) {
  const [count, setCount] = useState(defaultCount)
  let it = useRef()
  // 只执行一次
  useEffect(() => {
    setInterval(() => {
      it.current = setCount(count => count + 1)
    }, 1000)
  }, [])
  // 每次都执行
  useEffect(() => {
    if (count >= 10) {
      // 这里不能直接清除，因为每次函数进行渲染，it都是不一样的
      clearInterval(it.current)
    }
  })
  return [count, setCount]
}
function App() {
  const [count, setCount] = useCount(0)
  const Counter = useCounter(count)
  return (
    <div>
      <button onClick={() => {setCount(count + 1)}}>+</button>
        {Counter}
    </div>
  )
}
export default App
```
另一个例子，加入项目中有很多地方需要获取窗口的大小；通过自定义hooks获取窗口尺寸:

两个组件分享了useSize的逻辑
```js
import React, {useState, useRef, useEffect, useCallback} from 'react'
import './App.css'
function useCounter(count) {
  const size = useSize()
  return <h1>{size.width} -- {size.height}--{count}</h1>
}
function useSize() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  })
  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    })
  }, [])
  useEffect(() => {
    window.addEventListener('resize', onResize, false)
    return () => [
      window.removeEventListener('resize', onResize, false)
    ]
  }, [])
  return size
}
function App() {
  const Counter = useCounter(count)
  const size = useSize()
  return (
    <div>
      {size.width} -- {size.height}
        {Counter}
    </div>
  )
}
export default App
```

## Context
- Context
- ContextType
- lazy
- Superse
- memo 优化性能

Context 提供了一种方式，能够让数据在组件树中传递而不必一级一级手动传递。使用：
使用createContext这个API去创建一个context，他会给后代组件提供一个Provider进行管理，但是后代组件不能直接获取到值，需要使用Consumer进行获取。

如果context的值发送改变，他会重新渲染Provider下面的所有的元素。
```js
import React, { createContext } from 'react'
import './App.css'
const BatterContext = createContext()
function Leaf() {
  return (
    <BatterContext.Consumer>
      {
        // 后代组件中听过Consumer获取共享的值，在Consumer中需要写一个函数。函数的唯一参数就是这个context的值。
        battery => <h1>Battery: {battery}</h1>
      }
    </BatterContext.Consumer>
  )
}
function Middle() {
  return <Leaf />
}
function App() {
  return (
    <BatterContext.Provider value={60}>
      <Middle/>
    </BatterContext.Provider>
  )
}

export default App
```
组件中使用多个context：
```js
import React, { createContext, useState } from 'react'
import './App.css'
const BatterContext = createContext()
const OnlineContext = createContext()
function Leaf() {
  return (
    <BatterContext.Consumer>
      {
        battery => (
          <OnlineContext.Consumer>
            {
              online => <h1>Battery: {battery}, Online: {String(online)}</h1>
            }
          </OnlineContext.Consumer>
        )
      }
    </BatterContext.Consumer>
  )
}
function Middle() {
  return <Leaf />
}
function App() {
  const [battery, setBattery] = useState(60)
  const [online, setOnline] = useState(false)
  return (
    <BatterContext.Provider value = {battery}>
      <OnlineContext.Provider value = {online}>
        <button onClick={() => { setBattery(battery + 1)} }>+</button>
        <button onClick={() => { setOnline(!online)} }>switch</button>
        <Middle/>
      </OnlineContext.Provider>
    </BatterContext.Provider>
  )
}

export default App
```

> createContext 的参数是当Context.Consumer找不到Context.Provider的时候，进行获取到的值。

### contextType 的用法

代码：替换了Context.Consumer，
```js
import React, { createContext, useState, Component } from 'react'
import './App.css'
const BatterContext = createContext()
const OnlineContext = createContext()
class Leaf extends Component {
  static contextType  = BatterContext
  render() {
    const battery = this.context
    return (
      <h1>Battery: {battery}</h1>
    )
  }
}
function Middle() {
  return <Leaf />
}
function App() {
  const [battery, setBattery] = useState(60)
  const [online, setOnline] = useState(false)
  return (
    <BatterContext.Provider value = {battery}>
        <button onClick={() => { setBattery(battery + 1)} }>+</button>
        <Middle/>
    </BatterContext.Provider>
  )
}

export default App
```

### lazy
使用：About是另一个组件
```js
import React, { lazy, Suspense } from 'react'
import './App.css'

const About = lazy(() => import(/*webpackChunkName: "about"*/'./About'))

class App extends React.Component {
  render() {
    // fallback传入一个jsx的组件
    return (
      <div>
        <Suspense fallback = { <div>加载中</div> }>
          <About/>
        </Suspense>
      </div>
    )
  }
}

export default App
```
使用componentDidCatch声明周期函数捕获渲染失败的问题：
```js
import React, { lazy, Suspense } from 'react'
import './App.css'

const About = lazy(() => import(/*webpackChunkName: "about"*/'./About'))

class App extends React.Component {
  state = {
    hasError: false
  }
  componentDidCatch() {
    this.setState({
      hasError: true
    })
  }
  render() {
    if (this.state.hasError) {
      return <div>Error</div>
    }
    // fallback传入一个jsx的组件
    return (
      <div>
        <Suspense fallback = { <div>加载中</div> }>
          <About/>
        </Suspense>
      </div>
      )
  }
}

export default App
```
也可以使用静态方法去捕获:
```js
import React, { lazy, Suspense } from 'react'
import './App.css'

const About = lazy(() => import(/*webpackChunkName: "about"*/'./About'))

class App extends React.Component {
  state = {
    hasError: false
  }
  // componentDidCatch() {
  //   this.setState({
  //     hasError: true
  //   })
  // }
  static getDerivedStateFromError() {
    return {
      hasError: true
    }
  }
  render() {
    if (this.state.hasError) {
      return <div>Error</div>
    }
    // fallback传入一个jsx的组件
    return (
      <div>
        <Suspense fallback = { <div>加载中</div> }>
          <About/>
        </Suspense>
      </div>
      )
  }
}

export default App
```

### 项目优化
父组件状态值改变会重新渲染子组件，可以使用shouldComponentUpdate进行优化：
在子组件中添加判断。
```js
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(nextProps, nextState)
    // 如果即将渲染的的name跟当前的一直不进行渲染
    if (nextProps.name === this.props.name) {
      return false
    }
    return true
  }
```
可以使用PureComponent组件代替上面的效果，不过存在局限性，传入的props如果是一个复杂的对象，不会检测是否发生变化：
```js
import React, { Component, PureComponent } from 'react'
import './App.css'
class Foo extends PureComponent {
  render() {
    console.log('Foo render')
    return null
  }
}
class App extends PureComponent {
  state = {
    count: 0
  }
  render() {
    return (
        <div>
          <button onClick={() => {this.setState({count: this.state.count + 1})}}>Press</button>
          <Foo name="jiegiser"></Foo>
        </div>
      )
  }
}

export default App
```

对于无状态组件，也就是函数式声明的组件，可以使用memo函数实现性能的优化：
```js
import React, {PureComponent, memo } from 'react'
import './App.css'
const Foo = memo(function Foo() {
  console.log('Foo render')
  return null
})
class App extends PureComponent {
  state = {
    count: 0
  }
  render() {
    return (
        <div>
          <button onClick={() => {this.setState({count: this.state.count + 1})}}>Press</button>
          <Foo name="jiegiser"></Foo>
        </div>
      )
  }
}

export default App
```
useMemo以及useCallback是经常用来优化项目的，监听依赖的变量，阻止在子元素中每次都进行渲染。

使用dispatch以及action以及hooks实现一个简单的todilist：
```js
import React, {useState, useRef, useEffect, useCallback} from 'react'
import './App.css'
let idSeq = Date.now()
function Control(props) {
  const { dispatch } = props
  const inputRef = useRef()
  const onSubmit = (e) => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()
    if (newText.length === 0) {
      return
    }
    dispatch({
      type: 'add',
      payload: {
        id: ++idSeq,
        text: newText,
        complete: false
      }
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
  }, dispatch} = props
  const onChange = () => {
    dispatch({
      type: 'toggle',
      payload: id
    })
  }
  const onRemove = () => {
    dispatch({
      type: 'remove',
      payload: id
    })
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

function TodoList() {
  const [todos, setTodos] = useState([])
  // const addTodo = (todo) => {
  //   setTodos(todos => [...todos, todo])
  // }
  // const removeTodos = (id) => {
  //   setTodos(todos => todos.filter(todo => {
  //     return todo.id !== id
  //   }))
  // }
  // const toggleTodo = (id) => {
  //   setTodos(todos => todos.map(todo => {
  //     return todo.id === id ? {
  //       ...todo,
  //       complete: !todo.complete
  //     }:todo
  //   }))
  // }
  // 使用dispatch以及action管理数据
  const dispatch = useCallback((action) => {
    const {type, payload} = action
    switch(type) {
      case 'set':
        setTodos(payload)
        break
      case 'add':
        setTodos(todos => [...todos, payload])
        break
      case 'remove':
        setTodos(todos => todos.filter(todo => {
          return todo.id !== payload
        }))
        break
      case 'toggle':
        setTodos(todos => todos.map(todo => {
          return todo.id === payload ? {
            ...todo,
            complete: !todo.complete
          }:todo
        }))
        break
      default:
    }
  }, [])

  // 注意hooks函数是有顺序的
  // 程序初始化调用，只执行一次
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    console.log(todos, 'todoGet')
    // setTodos(todos)
    dispatch({
      type: 'set',
      payload: todos
    })
  }, [])
  // 只要todos变化就执行，监听todos
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
    console.log(todos, 'todoSet')
  }, [todos])

  return (
    <div className="todo-list">
      <Control dispatch={dispatch}></Control>
      <Todos dispatch={dispatch} todos={todos}></Todos>
    </div>
  )
}
export default TodoList
```
样式部分：
```css
.todo-list {
  width: 550px;
  margin: 300px auto;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgb(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}
.control h1 {
  width: 100%;
  font-size: 100px;
  text-align: center;
  margin: 0;
  color: rgba(175, 47, 47, 0.15);
}
.control .new-todo {
  padding: 16px 16px 16px 60px;
  border: 0;
  outline: none;
  font-size: 24px;
  box-sizing: border-box;
  width: 100%;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.3);
}
.todos {
  margin: 0;
  padding: 0;
  list-style: none;
}
.todo-item {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 24px;
  display: flex;
  align-items: center;
}
.todo-item label {
  flex: 1;
  padding: 15px 15px 15px 0;
  line-height: 1.2;
  display: block;
}
.todo-item label.complete {
  text-decoration: line-through;
}
.todo-item button {
  border: 0;
  outline: 0;
  display: block;
  width: 40px;
  text-align: center;
  font-size: 30px;
  color: #cc9a9a;
}
```
对于action每次都需要进行构建，可以新建一个actionCreators.js文件，进行构建action，actionCreators。
```js
import React, {useState, useRef, useEffect} from 'react'
import {
  createAdd,
  createRemove,
  createSet,
  createToggle
} from './actionCreators'
import './App.css'
let idSeq = Date.now()

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

function TodoList() {
  const [todos, setTodos] = useState([])
  // 使用dispatch以及action管理数据
  const dispatch = (action) => {
    const {type, payload} = action
    switch(type) {
      case 'set':
        setTodos(payload)
        break
      case 'add':
        setTodos(todos => [...todos, payload])
        break
      case 'remove':
        setTodos(todos => todos.filter(todo => {
          return todo.id !== payload
        }))
        break
      case 'toggle':
        setTodos(todos => todos.map(todo => {
          return todo.id === payload ? {
            ...todo,
            complete: !todo.complete
          }:todo
        }))
        break
      default:
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
// actionCreators.js
export function createSet(payload) {
  return {
    type: 'set',
    payload
  }
}
export function createAdd(payload) {
  return {
    type: 'add',
    payload
  }
}
export function createRemove(payload) {
  return {
    type: 'remove',
    payload
  }
}
export function createToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}
```
使用reducer来管理数据，以及使用combineReducers合并多个reducer：
```js
import React, {useState, useRef, useEffect} from 'react'
import {
  createAdd,
  createRemove,
  createSet,
  createToggle
} from './actionCreators'
import './App.css'
let idSeq = Date.now()

// 将多个reducer合并为一个总的reducers
function combineReducers(reducers) {
  return function reducer(state, action) {
    const change = {}
    for (let key in reducers) {
      change[key] = reducers[key](state[key], action)
    }
    return {
      ...state,
      ...change
    }
  }
}

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

function TodoList() {
  const [todos, setTodos] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)

  // 对reducer进行拆分：
  const reducers = {
    todos(state, action) {
      const {type, payload} = action
      switch(type) {
        case 'set':
          return payload
        case 'add':
          return [...state, payload]
        case 'remove':
          return state.filter(todo => {
            return todo.id !== payload
          })
        case 'toggle':
          return state.map(todo => {
            return todo.id === payload ? {
              ...todo,
              complete: !todo.complete
            }:todo
          })
      }
      return state
    },
    incrementCount(state, action) {
      const {type} = action
      switch(type) {
        case 'add':
        case 'set':
          return state + 1
      }
      return state
    }
  }
  const reducer = combineReducers(reducers)
  // function reducer(state, action) {
  //   const {type, payload} = action
  //   const { todos, incrementCount } = state
  //   switch(type) {
  //     case 'set':
  //       return {
  //         ...state,
  //         todos: payload,
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'add':
  //       return {
  //         ...state,
  //         todos: [...todos, payload],
  //         incrementCount: incrementCount + 1
  //       }
  //     case 'remove':
  //       return {
  //         ...state,
  //         todos: todos.filter(todo => {
  //           return todo.id !== payload
  //         })
  //       }
  //     case 'toggle':
  //       return {
  //         ...state,
  //         todos: todos.map(todo => {
  //           return todo.id === payload ? {
  //             ...todo,
  //             complete: !todo.complete
  //           }:todo
  //         })
  //       }
  //   }
  //   return state
  // }


  // 使用dispatch以及action管理数据
  const dispatch = (action) => {
    const state = {
      todos,
      incrementCount
    }
    const setters = {
      todos: setTodos,
      incrementCount: setIncrementCount
    }
    const newState = reducer(state, action)
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
```
如果我们处理的action是异步操作，可以这样：
```js
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
// reducer.js
  const reducers = {
    todos(state, action) {
      const {type, payload} = action
      switch(type) {
        case 'set':
          return payload
        case 'add':
          return [...state, payload]
        case 'remove':
          return state.filter(todo => {
            return todo.id !== payload
          })
        case 'toggle':
          return state.map(todo => {
            return todo.id === payload ? {
              ...todo,
              complete: !todo.complete
            }:todo
          })
      }
      return state
    },
    incrementCount(state, action) {
      const {type} = action
      switch(type) {
        case 'add':
        case 'set':
          return state + 1
      }
      return state
    }
  }
  // 将多个reducer合并为一个总的reducers
function combineReducers(reducers) {
  return function reducer(state, action) {
    const change = {}
    for (let key in reducers) {
      change[key] = reducers[key](state[key], action)
    }
    return {
      ...state,
      ...change
    }
  }
}
export default combineReducers(reducers)
// actionCreators.js
export function createSet(payload) {
  return {
    type: 'set',
    payload
  }
}
let idSeq = Date.now()
export function createAdd(text) {
  return (dispatch, getSate) => {
    const { todos } = getSate()
    if(!todos.find(todo => todo.text === text)) {
      dispatch({
        type: 'add',
        payload: {
          id: ++idSeq,
          text,
          complete: false
        }
      })
    }
  }
}
export function createRemove(payload) {
  return {
    type: 'remove',
    payload
  }
}
export function createToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}
```