// 封装axios
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 导出基地址
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
// 请求myAxios
const $http = axios.create({
  baseURL
})

// 定义请求拦截器
$http.interceptors.request.use(function (config) {
  // 判断
  if(store.state.token) {
    // 发起携带请求头和token
    config.headers.Authorization = store.state.token
  }
  // 请求前触发一次
  return config
}, function (error) {
  // 请求发起前的代码 如果有异常 会直接return
  return Promise.reject(error)  // return new Promise 状态为失败
})

// 请求拦截器
$http.interceptors.response.use(function (response) {
  return response
},function (error) {
  if(error.response.status === 401) {
    // token过期 清楚本地token
    // window.sessionStorage.clear()
    store.commit('updateToken','')
    store.commit('updateUserInfo', {})
    router.push('/login')
  }
  return Promise.reject(error)
})
export default $http
