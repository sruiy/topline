import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
request.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    console.log(err)
    return data
  }
}]
request.interceptors.request.use(function (config) {
  const { userInfo } = store.state
  if (userInfo) {
    config.headers.Authorization = `Bearer${userInfo}`
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

export default request
