<!--
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:53:22
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-09 09:17:46
 -->
## Context

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