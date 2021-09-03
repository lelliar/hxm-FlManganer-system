import router, { publicRoutes } from '@/router/index'
import { asyncRoutes } from '@/router/homeChildren'
import store from '../store/index'

const whiteList = publicRoutes.map((route) => route.path)
router.beforeEach((to, form, next) => {
  const currentRole = store.state.userInfo.role
  if (currentRole) {
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      this.$message({
        type: 'error',
        message: '请先登录'
      })
    }
  }
})

export const buildRoute = function (role) {
  const routes = []
  asyncRoutes.forEach((route) => {
    role.forEach((item) => {
      if (route.meta.roles && route.meta.roles.includes(item)) {
        routes.push(item)
      }
    })
  })
  return {
    asyncRoutes: routes,
    allRoutes: [...publicRoutes, ...routes]
  }
}
