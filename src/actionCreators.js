/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 07:59:07
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 12:41:20
 */
export function createSet(payload) {
  return {
    type: 'set',
    payload
  }
}
let idSeq = Date.now()
export function createAdd(text) {
  return (dispatch, getSate) => {
    const { todos } = getSate()
    if(!todos.find(todo => todo.text === text)) {
      dispatch({
        type: 'add',
        payload: {
          id: ++idSeq,
          text,
          complete: false
        }
      })
    }
  }
}
export function createRemove(payload) {
  return {
    type: 'remove',
    payload
  }
}
export function createToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}