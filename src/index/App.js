/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:01:12
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-14 09:21:34
 */
import React, { useCallback, useMemo } from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import './App.css'

import Header from '../common/Header.js';
import DepartDate from './DepartDate.js';
import HighSpeed from './HighSpeed.js';
import Journey from './Journey.js';
import Submit from './Submit.js';

import CitySelector from '../common/CitySelector.js';

import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity
} from './actions'
function App(props) {
  const {
    from,
    to,
    isCitySelectorVisible,
    isDateSelectorVisible,
    cityData,
    isLoadingCityData,
    highSpeed,
    dispatch,
    departDate,
  } = props
  // useCallback防止header组件重新渲染
  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const cbs = useMemo(() => {
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector
    }, dispatch)
  }, [])

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity,
    }, dispatch)
  }, [])
  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack} />
      </div>
      <form className="form">
        <Journey
          from={from}
          to={to}
          {
            ...cbs
          }
        />
        <DepartDate/>
        <HighSpeed/>
        <Submit/>
      </form>
      <CitySelector
        show={ isCitySelectorVisible }
        cityData={ cityData }
        isLoading={ isLoadingCityData }
        {...citySelectorCbs}
      />
    </div>
  )
}
const mapStateToProps = state => {
  return state
}
const mapDispatchToProps = dispatch => {
  return {dispatch}
}
export default connect(mapStateToProps, mapDispatchToProps)(App)