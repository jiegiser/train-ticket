/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-16 08:18:06
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-16 20:02:01
 */
import React, {
  memo,
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import URI from 'urijs'
import leftPad from 'left-pad'
import dayjs from 'dayjs'
import './Schedule.css'

const ScheduleRow = memo(function ScheduleRow(props) {
  const {
    index, // 序号
    station, // 车站名
    arriveTime, //到达时间
    departTime,
    stay, // 停留时长

    isStartStation, // 是否是始发站
    isEndStation,
    isDepartStation, // 是否是出发车站
    isArriveStation,
    beforeDepartStation, // 是否在出发车站之前
    afterArriveStation
  } = props
  return (
    <li>
      <div className={classnames('icon', {
        'icon-red': isDepartStation || isArriveStation
      })}>
        {
          isDepartStation
          ? '出'
          : isArriveStation
            ? '到'
            : leftPad(index, 2, 0)
        }
      </div>
      <div className={classnames('row', {
        gray: beforeDepartStation || afterArriveStation
      })}>
        <span className={classnames('station', {
          red: isArriveStation || isDepartStation
        })}>
          {station}
        </span>
        <span className={classnames('arrtime', {
          red: isArriveStation
        })}>
          {
            isArriveStation ? '始发站' : arriveTime
          }
        </span>
        <span className={classnames('deptime', {
          red: isDepartStation
        })}>
          {
            isEndStation ? '始发站' : departTime
          }
        </span>
        <span className="stoptime">
          {
            isStartStation || isEndStation ? '-' : stay + '分'
          }
        </span>
      </div>
    </li>
  )
})
ScheduleRow.propTypes = {}

const Schedule = memo(function Schedule(props) {
  const {
    date,
    trainNumber,
    departStation,
    arriveStation
  } = props

  const [scheduleList, setScheduleList] = useState([])

  useEffect(() => {
    const url = new URI('/rest/schedule')
      .setSearch('trainNumber', trainNumber)
      .setSearch('departStation', departStation)
      .setSearch('arriveStation', arriveStation)
      .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
      .toString()
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let departRow
        let arriveRow
        for (let i = 0; i < data.length; ++i) {
          if (!departRow) {
            if (data[i].station === departStation) {
              departRow = Object.assign(data[i], {
                beforeDepartStation: false,
                isDepartStation: true,
                afterArriveStation: false,
                isArriveStation: false,
              })
            } else {
             Object.assign(data[i], {
                beforeDepartStation: true,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: false
              })
            }
          } else if (!arriveRow) {
            if (data[i].station === arriveStation) {
              arriveRow = Object.assign(data[i], {
                beforeDepartStation: false,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: true
              })
            } else {
              Object.assign(data[i], {
                beforeDepartStation: false,
                isDepartStation: false,
                afterArriveStation: false,
                isArriveStation: false,
              })
            }
          } else {
            Object.assign(data[i], {
              beforeDepartStation: false,
              isDepartStation: false,
              afterArriveStation: true,
              isArriveStation: false
            })
          }
          Object.assign(data[i], {
              isStartStation: i === 0,
              isEndStation: i === data.length - 1
          })
       }
      setScheduleList(data)
    })
  }, [date, trainNumber, departStation, arriveStation])
  return (
    <div className="schedule">
      <div className="dialog">
        <h1>列车时刻表</h1>
        <div className="head">
          <span className="station">车站</span>
          <span className="deptime">到达</span>
          <span className="arrtime">发车</span>
          <span className="stoptime">停留时间</span>
        </div>
        <ul>
          { 
            scheduleList.map((schedule, index) => {
              return (
                <ScheduleRow
                  key={schedule.station}
                  index={index + 1}
                  {...schedule}
                />
              );
            })
          }
        </ul>
      </div>
    </div>
  )
})
Schedule.propTypes = {
  date: PropTypes.number.isRequired,
  trainNumber: PropTypes.string.isRequired,
  departStation: PropTypes.string.isRequired,
  arriveStation: PropTypes.string.isRequired
}
export default Schedule