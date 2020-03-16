/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-17 07:55:06
 */
import React, {
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense
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
import { TrainContext } from './context'
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
import { bindActionCreators } from 'redux'
// 异步加载组件
const Schedule = lazy(() => import('./Schedule'))
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
  useEffect(() => {
    if (!searchParsed) {
      return
    }
    const url = new URI('/rest/ticket')
      .setQuery('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('trainNumber', trainNumber)
      .toString()
    fetch(url)
      .then(response => response.json())
      .then(result => {
      const { detail, candidates } = result
      const {
          departTimeStr,
          arriveTimeStr,
          arriveDate,
          durationStr
      } = detail
      dispatch(setDepartTimeStr(departTimeStr))
      dispatch(setArriveTimeStr(arriveTimeStr))
      dispatch(setArriveDate(arriveDate))
      dispatch(setDurationStr(durationStr))
      dispatch(setTickets(candidates))
    })
  }, [searchParsed, departDate, trainNumber])
  const {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  } = useNav(departDate, dispatch, prevDate, nextDate)

  const detailCbs = useMemo(() => {
    return bindActionCreators({
      toggleIsScheduleVisible
    }, dispatch)
  }, [])

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
        <div className="detail-wrapper">
          <Detail
            departDate={departDate}
            arriveDate={arriveDate}
            departTimeStr={departTimeStr}
            arriveTimeStr={arriveTimeStr}
            trainNumber={trainNumber}
            departStation={departStation}
            arriveStation={arriveStation}
            durationStr={durationStr}
            {
              ...detailCbs
            }
          />
        </div>
        <TrainContext.Provider value={
          {
            trainNumber,
            departStation,
            arriveStation,
            departDate
          }
        }>
          <Candidate
            tickets={tickets}
          />
        </TrainContext.Provider>
        {
          isScheduleVisible && (
            <div className="mask" onClick={() => {dispatch(toggleIsScheduleVisible())}}>
              <Suspense fallback={<div>loading</div>}>
                  <Schedule
                    date={departDate}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                  />
              </Suspense>
            </div>
          )
        }
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