/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:02:13
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-17 08:10:24
 */
import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
  combineReducers(reducers),
  {
    trainNumber: null,
    departStation: null,
    arriveStation: null,
    seatType: null,
    departDate: Date.now(),
    arriveDate: Date.now(),
    departTimeStr: null,
    arriveTimeStr: null,
    durationStr: null,
    price: null,
    passengers: [], // 乘客信息
    menu: null, // 弹出菜单
    isMenuVisible: false,
    searchParsed: false
  },
  applyMiddleware(thunk)
)