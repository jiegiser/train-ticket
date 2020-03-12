/*
 * @Descripttion: 
 * @Author: jiegiser
 * @Date: 2020-03-12 09:22:24
 * @LastEditors: jiegiser
 * @LastEditTime: 2020-03-12 09:25:04
 */
  // 对reducer进行拆分：
  const reducers = {
    todos(state, action) {
      const {type, payload} = action
      switch(type) {
        case 'set':
          return payload
        case 'add':
          return [...state, payload]
        case 'remove':
          return state.filter(todo => {
            return todo.id !== payload
          })
        case 'toggle':
          return state.map(todo => {
            return todo.id === payload ? {
              ...todo,
              complete: !todo.complete
            }:todo
          })
      }
      return state
    },
    incrementCount(state, action) {
      const {type} = action
      switch(type) {
        case 'add':
        case 'set':
          return state + 1
      }
      return state
    }
  }
  // 将多个reducer合并为一个总的reducers
function combineReducers(reducers) {
  return function reducer(state, action) {
    const change = {}
    for (let key in reducers) {
      change[key] = reducers[key](state[key], action)
    }
    return {
      ...state,
      ...change
    }
  }
}
export default combineReducers(reducers)