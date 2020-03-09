/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:25:23
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-09 09:14:26
 */
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
