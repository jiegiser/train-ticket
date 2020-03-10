<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:53:22
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-10 08:35:43
 -->

## react hooks

### useState
他接收的可以是一个设置的初始值，也可以是一个回调函数：
```js
const [count, setCount] = useState(() => {
  return 0
})
```
然后setCount也可以接收一个函数，不过一般建议写函数：
```js
setCount(x => x + 1)
```

### useEffect
这个api相当于react几乎所有的的声明周期函数。根据[]里面的参数，如果里面的参数改变了，useEffect就会执行。
```js
useEffect(() => {
  // 如果没有第二个参数，这里的代码只执行一次，相当于moubted vue的。
  return () => {
    // 这里面只有组件注销的时候才会执行。。
  }
}, [])
```

### useRef
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
### Memo实现运行效率问题