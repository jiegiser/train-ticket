/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 19:00:48
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-18 09:20:30
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'normalize.css/normalize.css'
import * as serviceWorker from '../serviceWorker'
import store from './store'
import './index.css'
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
if ('production' === process.env.NODE_ENV) {
  serviceWorker.register()
} else {
  serviceWorker.unregister()
}