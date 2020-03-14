/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-14 17:09:46
 */
import React from 'react'
import {connect} from 'react-redux'
import './App.css'

import Header from '../common/Header'
import Nav from '../common/Nav'
import List from './List'
import Bottom from './Bottom'


function App(props) {
  return (
    <div>
      <Header/>
      <Nav/>
      <List/>
      <Bottom/>
    </div>
  )
}
const mapStateToProps = state => {
  return state
}
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)