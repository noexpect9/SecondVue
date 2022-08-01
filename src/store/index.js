import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    // 保存token
    updateToken(state, value) {
      state.token = value
    },
    updateUserInfo(state, value) {
      state.userInfo = value
    }
  },
  actions: {
    async getUserInfoActions(store) {
      const { data: res } = await getUserInfoAPI()
      store.commit('updateUserInfo',res.data)
    }
  },
  getters: {
    // 多种写法
    // username(state) {
    //   return state.userInfo.username
    // }
    // username: state => {
    //   return state.userInfo.username
    // }
    username: state => state.userInfo.username,
    nickname: state => state.userInfo.nickname,
    user_pic: state => state.userInfo.user_pic

  },
  modules: {
  },
  plugins: [
    createPersistedState() // 注入持久化插件
  ]
})

// vuex是保存在内存中的
