import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    //redirect: '/login'
    component: () => import('@/views/layout')
  },
  {
    path: '/reg',
    component: () => import('@/views/register') //路由懒加载
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    component: () => import('@/views/layout')
  }
]

const router = new VueRouter({
  routes
})
// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 判断是否有token
  // !store.state.userInfo.username 有token并且vuex有数据
  if(token && !store.state.userInfo.username) {
    store.dispatch('getUserInfoActions')
  }
  next()
})

export default router
