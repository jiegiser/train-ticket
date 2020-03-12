/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:02:13
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 19:31:30
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
    from: '北京',
    to: '上海',
    isCitySelectorVisible: false,
    currentSelectingLeftCity: false,
    cityData: null,
    isLoadingCityData: false,
    isDateSelectorVisible: false,
    departDate: Date.now(),
    highSpeed: false,
  },
  applyMiddleware(thunk)
)