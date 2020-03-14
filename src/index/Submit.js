/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-13 08:06:09
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-14 16:19:11
 */
import React, {memo} from 'react'

import './Submit.css'

export default memo(function Submit(props) {
  return (
    <div>
      <button type="submit" className="submit-button">搜索</button>
    </div>
  )
})