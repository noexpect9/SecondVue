// 封装具体请求方法
import request from '@/utils/request'
// 导出
export const registerAPI = () => {
  // promise对象 return Promise对象
    return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username: 'lidongxu2',
      password: '111111',
      repassword: '111111'
    }
  })
}

