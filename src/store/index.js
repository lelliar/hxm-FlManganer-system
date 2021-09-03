import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: { name: undefined, role: undefined },
    routes: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setRoutes(state, routes) {
      state.routes = routes
    },
    setUserInfo(state, userInfo) {
      const { userName, userId } = userInfo
      this.state.name = userName
      this.state.role = userId
    }
  },
  getters: {
    gIsLogin(state) {
      return !!state.userInfo.name
    },
    routes(state) {
      return state.routes
        .filter(
          (route) =>
            route.name !== '404' &&
            route.name !== 'login' &&
            route.name !== 'Home' &&
            route.meta &&
            route.meta.title
        )
        .map((route) => ({
          title: route.meta.title,
          path: route.path
        }))
    }
  },
  actions: {},
  modules: {}
})
