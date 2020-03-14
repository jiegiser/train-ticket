/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:02:13
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-14 16:38:07
 */
import { h0 } from '../common/fp'
import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'
import * as constant from './constant'

export default createStore(
  combineReducers(reducers),
  {
    from: null,
    to: null,
    departDate: h0(Date.now()),
    highSpeed: false,
    trainList: [],
    orderType: constant.ORDER_DEPART,
    onlyTickets: false,
    ticketTypes: [],
    checkedTicketTypes: {},
    trainTypes: [],
    checkedTrainTypes: {},
    departStations: [],
    checkedDepartStations: {},
    arriveStations: [],
    checkedArriveStations: {},
    departTimeStart: 0,
    departTimeEnd: 24,
    arriveTimeStart: 0,
    arriveTimeEnd: 24,
    isFiltersVisible: false,
    searchParsed: false,
  },
  applyMiddleware(thunk)
)