import request from '@/utils/request'

/**
 *
 * @param {*} param0
 * @returns
 */
export const registerAPI = ({ username, password, repassword }) => {
  // promise对象 return Promise对象
  return request({
    url: '/api/reg',
    method: 'POST',
    // axios传参params,data
    // params的对象参数名与值, axios源码会把出现再url?后面拼接给后台(query查询字符串)
    // data对象的名与值, axios源码会把参数和值,拼接在请求体中
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 *
 * @param username
 * @param password
 * @returns {AxiosPromise}
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息API
 * @returns {*}
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    // method不写默认就是get请求
  })
}

/**
 * 获取侧边栏API
 * @returns {AxiosPromise}
 */
export const getMenusListAPI = () => {
  return request({
    url: '/my/menus',
  })
}

/**
 * 更新用户信息
 * @param id
 * @param username
 * @param nickname
 * @param email
 * @param user_pic
 * @returns {AxiosPromise}
 */
export const updateUserInfoAPI = ({id, username, nickname, email, user_pic}) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 * 更新用户头像
 * @param avatar
 * @returns {AxiosPromise}
 */
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 *
 * @param old_pwd
 * @param new_pwd
 * @param re_pwd
 * @returns {AxiosPromise}
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
