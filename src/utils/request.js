// 封装axios
import axios from 'axios'
// 请求myAxios
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net/'
})
export default myAxios
