<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:53:22
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-11 08:36:06
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