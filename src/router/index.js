import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import el from 'element-ui/src/locale/lang/el'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    //redirect: '/login'
    component: () => import('@/views/layout/Layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/Home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/UserInfo')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/UserAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/UserChangePwd')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/article/ArtCate')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register/Register') //路由懒加载
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login')
  },
  {
    path: '/home',
    component: () => import('@/views/layout/Layout')
  }
]

const router = new VueRouter({
  routes
})

// 白名单 无需登陆可以访问的路由地址
let whiteList = ['/login','/red']

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 判断是否有token
  if(token) {
    // !store.state.userInfo.username 有token并且vuex有数据
    if(!store.state.userInfo.username) {
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 数组includes判断是否再数组里出现过 返回布尔值
    if(whiteList.includes(to.path)) {
      next()
    } else {
      // 未登录 强制切换到登陆
      next('/login')
    }
  }
})

export default router
