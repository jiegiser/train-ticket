/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-16 08:57:58
 */
import React, {
  useEffect,
  useCallback
} from 'react'
import {connect} from 'react-redux'
import URI from 'urijs';
import dayjs from 'dayjs';
import { h0 } from '../common/fp'
import useNav from '../common/useNav'
import Header from '../common/Header'
import Nav from '../common/Nav'
import Detail from '../common/Detail'
import Candidate from './Candidate'
import './App.css'

import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setDepartDate,
  setSearchParsed,
  prevDate,
  nextDate,
  setDepartTimeStr,
  setArriveTimeStr,
  setArriveDate,
  setDurationStr,
  setTickets,
  toggleIsScheduleVisible
} from './actions'
function App(props) {
  const {
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed,
    dispatch
  } = props

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  // 解析url参数-只执行一次
  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)
    const {
      aStation,
      dStation,
      trainNumber,
      date
    } = queries
    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setDepartDate(h0(dayjs(date).valueOf())))

    dispatch(setSearchParsed(true))
  }, [])
  useEffect(() => {
    document.title = trainNumber
  }, [trainNumber])
  const {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  } = useNav(departDate, dispatch, prevDate, nextDate)
  // 如果没有解析完成不进行渲染页面
  if(!searchParsed) {
    return null
  }
  return (
    <div className="app">
      <div className="header-wrapper">
        <Header
          title={trainNumber}
          onBack={onBack}
        />
      </div>
      <div className="nav-wrapper">
        <Nav
          date={departDate}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          prev={prev}
          next={next}
        />
      </div>
    </div>
  )
}
const mapStateToProps = state => {
  return state
}
const mapDispatchToProps = dispatch => {
  console.log(dispatch)
  return { 
    dispatch 
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)