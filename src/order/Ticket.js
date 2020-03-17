/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-17 08:16:05
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-17 19:28:50
 */
import React, {
  memo
} from 'react'
import PropTypes from 'prop-types'
import './Ticket.css'
const Ticket = memo(function Ticket(props) {
  const { price, type } = props
  return (
    <div className="ticket">
      <p>
        <span className="ticket-type">{type}</span>
        <span className="ticket-price">{price}</span>
      </p>
      <div className="label">坐席</div>
    </div>
  )
})
Ticket.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string.isRequired
}
export default Ticket