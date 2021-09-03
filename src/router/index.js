import Vue from 'vue'
import VueRouter from 'vue-router'
import progressOption from '../../progress.config'
// import { Message } from 'element-ui'
Vue.use(VueRouter)

export const publicRoutes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      progressOption
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName:"home" */ '@/views/home.vue'),
    meta: {
      title: '主页'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login.vue'),
    meta: {
      progressOption,
      title: '登录'
    }
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
  }
]

const router = new VueRouter({
  // 由于是后台，为了简单起见使用hash
  mode: 'hash',
  routes: publicRoutes
})

// router.beforeEach((to, from, next) => {
//   if (to.path != '/login' && to.name != '404' && !localStorage.token) {
//     Message.error('请先登录')
//     next({
//       path: '/login'
//     })
//   } else {
//     next()
//   }
// })

export default router
