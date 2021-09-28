import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: { name: null, role: null },
    routes: [],
    asyncRoute: []
  },
  mutations: {
    setAsyncRoute(state, asyncRoute) {
      state.asyncRoute = asyncRoute
      localStorage.setItem('asyncRoutes', JSON.stringify(asyncRoute))
    },
    updateAsyncRoute(state) {
      state.asyncRoute.forEach((item) => {
        router.addRoute('Home', item)
      })
      //   state.routes = router
      //   localStorage.setItem('routes', JSON.stringify(router))
    },
    setToken(state, token) {
      state.token = token
    },
    setRoutes(state, routes) {
      state.routes = routes
      localStorage.setItem('routes', JSON.stringify(routes))
    },
    setUserInfo(state, userInfo) {
      const { userName, userId } = userInfo
      state.userInfo.name = userName
      state.userInfo.role = userId
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  },
  getters: {
    gIsLogin(state) {
      return !!state.userInfo.name
    }
    // routes(state) {
    //   return state.routes
    //     .filter(
    //       (route) =>
    //         route.name !== '404' &&
    //         route.name !== 'login' &&
    //         route.name !== 'Home' &&
    //         route.meta &&
    //         route.meta.title
    //     )
    //     .map((route) => ({
    //       title: route.meta.title,
    //       path: route.path,
    //       icon: route.meta.icon
    //     }))
    // }
  },
  actions: {},
  modules: {}
})
