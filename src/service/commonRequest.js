// 通用请求
import axios from './instance'

export const getSelect = (url, data) => {
  return axios.post(url, data)
}
// 查询
export const getData = (url, data) => {
  return axios.post(url, data)
}
// 根据id查询
export const getByIdData = (url) => {
  return axios.get(url)
}
// 修改
export const changeData = (url, data) => {
  return axios.post(url, data)
}
// 添加
export const addData = (url, data) => {
  return axios.post(url, data)
}
// 删除
export const deleteData = (url) => {
  return axios.get(url)
}
// 分页查询
export const getDataByPage = (url, page) => {
  return axios.post(url, page)
}
