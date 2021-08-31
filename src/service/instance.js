import axios from 'axios'
import { CODE_VERIFICATION, LEGAL_CODES } from '@/config'
import { Message } from 'element-ui'
import { storage } from './storage'

axios.default.timeout = 3000
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
axios.interceptors.request.use((config) => {
  const token = storage.get('token').data
  token && (config.headers.token = token)
  config.url?.includes('/proxy/') && (config.baseURL = '')
  return config
})

axios.interceptors.response.use(
  (response) => {
    try {
      if (response.data && CODE_VERIFICATION) {
        const { code, msg } = response.data
        let isLegal = false
        for (const item in LEGAL_CODES) {
          if (item == code) isLegal = true
        }
        if (!isLegal) {
          Message.error(msg)
          return Promise.reject(new Error({ code, msg }))
        }
      }
      if (response.data) return response
      Message.error('response Data 值错误')
      return Promise.reject(new Error(response))
    } catch (e) {
      Message.error('响应拦截器代码报错')
      return Promise.reject(e.message)
    }
  },
  (error) => {
    if (error.response) {
      return Promise.reject(new Error({ code: error.response.code, data: error.response.data }))
    }
    Message({
      type: 'error',
      message: '网络出错啦！！'
    })
    return Promise.reject(error.message)
  }
)
export default axios
