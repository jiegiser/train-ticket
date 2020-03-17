/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-17 20:13:41
 */
import React, {
  useCallback,
  useEffect,
  useMemo
} from 'react'
import URI from 'urijs'
import dayjs from 'dayjs'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import './App.css'
import Header from '../common/Header'
import Detail from '../common/Detail'
import Account from './Account'
import Choose from './Choose'
import Passengers from './Passengers'
import Ticket from './Ticket'
import Menu from './Menu'

import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setSeatType,
  setDepartDate,
  setSearchParsed,
  fetchInitial,
  createAdult,
  createChild,
  removePassenger,
  updatePassenger,
  hideMenu,
  showGenderMenu,
  showFollowAdultMenu,
  showTicketTypeMenu,
} from './actions'
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

  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  // 解析url参数，只执行一次，所以第二个参数为空数组
  useEffect(() => {
    const queries = URI.parseQuery(window.location.search)
    const  {
      trainNumber,
      dStation,
      aStation,
      type,
      date
    } = queries
    dispatch(setTrainNumber(trainNumber))
    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setSeatType(type))
    dispatch(setDepartDate(dayjs(date).valueOf()))
    dispatch(setSearchParsed(true))
  }, [])
  useEffect(() => {
    if(!searchParsed) {
      return
    }
    const url = URI('/rest/order')
      .setSearch('dStation', departStation)
      .setSearch('aStation', arriveStation)
      .setSearch('type', seatType)
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .toString()
      dispatch(fetchInitial(url))
  }, [
    searchParsed,
    departStation,
    arriveStation,
    seatType,
    departDate
  ])
  const passengersCbs = useMemo(() => {
    return bindActionCreators(
      {
        createAdult,
        createChild,
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
      },
      dispatch
    )
  }, [])
  const menuCbs = useMemo(() => {
    return bindActionCreators(
      {
        hideMenu
      },
      dispatch
    )
  }, [])
  if(!searchParsed) {
    return null
  }
  return (
    <div className="app">
      <div className="header-wrapper">
        <Header
          title="订单填写"
          onBack={onBack}
        />
      </div>
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
        >
          <span
            style={{ display: 'block' }}
            className="train-icon"
          ></span>
        </Detail>
        <Ticket price={price} type={seatType} />
        <Passengers passengers={passengers} {...passengersCbs} />
        <Menu
          show={isMenuVisible}
          {
            ...menu
          }
          {
            ...menuCbs
          }
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