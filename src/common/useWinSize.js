/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-15 15:35:28
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-15 16:22:17
 */
import { useState, useEffect } from 'react'

export default function useWinSize() {
  const [width, setWidth] = useState(document.documentElement.clientWidth)
  const [height, setHeight] = useState(document.documentElement.clientHeight)

  const onResize = () => {
    setWidth(document.documentElement.clientWidth)
    setHeight(document.documentElement.clientHeight)
  }
  useEffect(() => {
    window.addEventListener('resize', onResize, false)
    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])
  return { width, height }
}
