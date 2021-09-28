import { publicRoutes, asyncRoutes } from '@/router/index'

export const buildRoute = function (role) {
  const routes = []
  asyncRoutes.forEach((route) => {
    const allRoutes = []
    allRoutes.push(...route.meta.roles)
    role.forEach((item) => {
      if (allRoutes && allRoutes.includes(item)) {
        routes.push(route)
      }
    })
  })
  return {
    asyncRoutes: routes,
    allRoutes: [...publicRoutes, ...routes]
  }
}
