import Vue from 'vue'
import VueRouter from 'vue-router'

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
  }
]

const router = new VueRouter({
  routes
})

export default router
