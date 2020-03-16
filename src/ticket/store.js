/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:02:13
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-16 07:57:20
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
    departDate: Date.now(),
    arriveDate: Date.now(),
    departTimeStr: null,
    arriveTimeStr: null,
    departStation: null,
    arriveStation: null,
    trainNumber: null,
    durationStr: null, // 运行时间-服务端
    tickets: [], // 座次车票类型
    isScheduleVisible: false,
    searchParsed: false //是否解析完成url-在发送fetch请求数据
  },
  applyMiddleware(thunk)
)