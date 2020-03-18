/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-13 07:46:25
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-18 09:50:57
 */
const express = require('express');
const path = require('path');
const apiMocker = require('mocker-api');

const app = express();

apiMocker(app, path.resolve('./mocker/mocker.js'))
app.listen(8000)