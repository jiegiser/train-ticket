/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:02:13
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-13 08:12:12
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
  // 默认的state数据
  {
    from: '北京',
    to: '上海',
    // 城市选择浮层
    isCitySelectorVisible: false,
    currentSelectingLeftCity: false,
    // 城市数据
    cityData: null,
    isLoadingCityData: false,
    isDateSelectorVisible: false,
    departDate: Date.now(),
    highSpeed: false,
  },
  applyMiddleware(thunk)
)