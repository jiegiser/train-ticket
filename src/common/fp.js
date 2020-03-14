/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-14 10:49:47
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-14 10:50:36
 */
// 获取当天的0时0分0秒
export function h0(timestamp = Date.now()) {
  const target = new Date(timestamp)
  target.setHours(0)
  target.setMinutes(0)
  target.setSeconds(0)
  target.setMilliseconds(0)
  return target.getTime()
}