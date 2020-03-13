/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-13 08:09:34
 */
import React from 'react'
import {connect} from 'react-redux'
import './App.css'

import Header from '../common/Header.js';
import DepartDate from './DepartDate.js';
import HighSpeed from './HighSpeed.js';
import Journey from './Journey.js';
import Submit from './Submit.js';

function App(props) {
  return (
    <div>
      <Header/>
      <Journey/>
      <DepartDate/>
      <HighSpeed/>
      <Submit/>
    </div>
  )
}
const mapStateToProps = state => {
  
}
const mapDispatchToProps = dispatch => {

}
export default connect(mapStateToProps, mapDispatchToProps)(App)