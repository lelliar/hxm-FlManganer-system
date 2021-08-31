import router from '@/router'
import { Message } from 'element-ui'

export const storage = {
  set(key, data) {
    let obj = {
      data: data,
      time: Date.now(),
      expire: 86400000 // 一天
    }
    localStorage.setItem(key, JSON.stringify(obj))
  },
  get(key) {
    let val = localStorage.getItem(key)
    if (!val) {
      return new Error({ msg: '当前键已经不存在' })
    }
    val = JSON.parse(val)
    if (Date.now() - val.time > val.expire) {
      localStorage.removeItem(key)
      router.push('/')
      setTimeout(() => {
        Message.error('当前登录已过期，请重新登录')
      }, 1000)
      return console.warn('当前token已过期')
    }
    return val
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}
