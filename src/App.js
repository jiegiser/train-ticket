/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-09 08:25:23
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-10 08:35:55
 */
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
