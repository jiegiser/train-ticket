/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-17 08:27:48
 */
import React from 'react'
import {connect} from 'react-redux'
import './App.css'
import Header from '../common/Header'
import Detail from '../common/Detail'
import Account from './Account'
import Choose from './Choose'
import Passengers from './Passengers'
import Ticket from './Ticket'
import Menu from './Menu'
function App(props) {
  const {
    trainNumber,
    departStation,
    arriveStation,
    seatType,
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    durationStr,
    price,
    passengers,
    menu,
    isMenuVisible,
    searchParsed,
    dispatch
  } = props
  return (
    <div className="app">
      <div className="header-wrapper">
        <Header
          
        />
      </div>
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