import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  getters: {
  },
  mutations: {
    // 保存token
    updateToken(state, value) {
      state.token = value
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState() // 注入持久化插件
  ]
})

// vuex是保存在内存中的
