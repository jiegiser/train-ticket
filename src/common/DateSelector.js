/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-14 14:57:26
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-14 15:57:04
 */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {h0} from '../common/fp'

import Header from './Header'
import './DateSelector.css'

function Day(props) {
  const {
    day,
    onSelect
  } = props
  if(!day) {
    return <td className="null"></td>
  }
  const classes = []

  const now = h0()
  if(day < now) {
    classes.push('disabled')
  }
  if([6, 0].includes(new Date(day).getDay())) {
    classes.push('weekend')
  }

  const dateString = now === day ? '今天' : new Date(day).getDate()
  return (
    <td className={classnames(classes)} onClick={() => onSelect(day)}>
      {dateString}
    </td>
  )
}
Day.propTypes = {
  day: PropTypes.number,
  onSelect: PropTypes.func.isRequired
}


function Week(props) {
  const {
    days,
    onSelect
  } = props
  return (
    <tr className="date-table-days">
      {
        days.map((day, index) => {
          return (
            <Day
              key={index}
              day={day}
              onSelect={onSelect}
            />
          )
        })
      }
    </tr>
  )
}
Week.propTypes = {
  days: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}


function Month(props) {
  const {
    startingTimeInMonth,
    onSelect
  } = props
  // startingTimeInMonth是当前月第一天零时零分零秒
  // 下面是获取当前月所有日期

  const startDay = new Date(startingTimeInMonth)
  const currentDay = new Date(startingTimeInMonth)

  let days = []
  while(currentDay.getMonth() === startDay.getMonth()) {
    days.push(currentDay.getTime())
    currentDay.setDate(currentDay.getDate() + 1)
  }

  // 判断一号的日期，如果是星期日需要补齐六个空格，如果是其他日期只需要减一，比如星期四就是4-1
  days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6).fill(null).concat(days)
  
  // 最后一天的补齐
  const lastDay = new Date(days[days.length - 1])
  days = days.concat(new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null))
  
  // 所有日期以周进行分组
  const weeks = []

  for (let row = 0; row < days.length / 7; ++row) {
    const week = days.slice(row * 7, (row + 1) * 7)
    weeks.push(week)
  }
  return (
    <table className="date-table">
      <thead>
        <tr>
          <td colSpan="7">
            <h5>
              {
                startDay.getFullYear()}年{startDay.getMonth() + 1
              }月
            </h5>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr className="data-tanle-weeks">
          <th>周一</th>
          <th>周二</th>
          <th>周三</th>
          <th>周四</th>
          <th>周五</th>
          <th className="weekend">周六</th>
          <th className="weekend">周天</th>
        </tr>
        {
          weeks.map((week, index) => {
            return (
              <Week
                key={index}
                days={week}
                onSelect={onSelect}
              />
            )
          })
        }
      </tbody>
    </table>
  )
}
Month.propTypes = {
  startingTimeInMonth: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default function DateSelector(props) {
  const {
    show,
    onSelect,
    onBack
  } = props
  // 获取当前月第一天零时零分零秒以及下个月下下个月
  const now = new Date()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  now.setDate(1)

  const monthSequence = [now.getTime()]

  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime())

  now.setMonth(now.getMonth() + 1)
  monthSequence.push(now.getTime())
  
  return (
    <div className={classnames('date-selector', {
      hidden: !show
    })}>
      <Header
        title="日期选择"
        onBack={onBack}
      />
      <div className="date-selector-tables">
        {
          monthSequence.map(month => {
            return (
              <Month
                key={month}
                startingTimeInMonth={month}
                onSelect={onSelect}
              />
            )
          })
        }
      </div>
    </div>
  )
}
DateSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
}