/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:25:23
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-11 08:38:53
 */
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
  const size = useSize()
  return (
    <div>
      {size.width} -- {size.height}
      <button onClick={() => {setCount(count + 1)}}>+</button>
        {Counter}
    </div>
  )
}
export default App