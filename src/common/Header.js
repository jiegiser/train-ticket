/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-13 07:58:51
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-13 14:16:32
 */
import React from 'react'
import PropTypres from 'prop-types'
import './Header.css'

export default function Header(props) {
  const {
    onBack,
    title
  }  = props
  return (
    <div className="header">
      <div className="header-back" onClick={onBack}>
        <svg width="42" height="42">
          <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
          />
        </svg>
      </div>
      <h1 className="header-title">
        { title }
      </h1>
    </div>
  )
}
Header.propTypes = {
  onBack: PropTypres.func.isRequired,
  title: PropTypres.string.isRequired
}