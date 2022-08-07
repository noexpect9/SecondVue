// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index'
import dayjs from 'dayjs'

Vue.config.productionTip = false

Vue.prototype.$formatData = (date) => {
  return dayjs(date).format('YYYY-MM-DD:mm:ss')
}

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
