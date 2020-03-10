/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:25:23
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-10 20:26:48
 */
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
