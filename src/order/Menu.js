/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-17 08:26:22
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-17 20:20:23
 */
import React, {
  memo
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './Menu.css'

const MenuItem = memo(function MenuItem(props) {
  const { onPress, title, value, active } = props
  return (
    <li
      className={classnames({ active })}
      onClick={() => {onPress(value)}}
    >
      {title}
    </li>
  )
})
MenuItem.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  active: PropTypes.bool.isRequired
}
const Menu = memo(function Menu(props) {
  const {
    show,
    options, // 菜单项数组
    onPress,
    hideMenu
  } = props
  return (
    <div>
      {
        show && (
          <div className="menu-mask" onClick={() => hideMenu()}></div>
        )
      }
      <div className={classnames('menu', { show })}>
        <div className="menu-title"></div>
        <ul>
          {
            options && options.map(option => {
              return (
                <MenuItem
                  key={option.value}
                  {
                    ...option
                  }
                  onPress={onPress}
                />
              )
            })
          }
        </ul>
      </div>
    </div>
  )
})
Menu.propTypes = {
  show: PropTypes.bool.isRequired,
  options: PropTypes.array,
  onPress: PropTypes.func,
  hideMenu: PropTypes.func.isRequired  
}
export default Menu