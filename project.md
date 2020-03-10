<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:53:22
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-10 20:09:27
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