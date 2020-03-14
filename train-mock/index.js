/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-13 07:46:25
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-13 16:22:25
 */
const express = require('express')
const cityData = require('./data/city.json') 
const app = express()
app.get('/', (req, res) => {
  res.status(200)
  res.send('hello express')
  res.end()
})
app.get('/rest/cities', (req, res) => {
  res.json(cityData)
})
app.listen(6767)