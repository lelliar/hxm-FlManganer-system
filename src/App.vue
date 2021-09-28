<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import store from '@/store'
import { buildRoute } from '@sev/premission'
export default {
  created() {
    if (!store.state.userInfo.name) {
      const privilegs = JSON.parse(localStorage.getItem('privilegs'))
      const user = JSON.parse(localStorage.getItem('user'))
      const { asyncRoutes, allRoutes } = buildRoute(privilegs)
      this.$store.commit('setRoutes', allRoutes)
      this.$store.commit('setUserInfo', user)
      this.$store.commit('setAsyncRoute', asyncRoutes)
      this.$store.commit('updateAsyncRoute')
    } else {
      const asyncRoute = JSON.parse(localStorage.getItem('asyncRoutes'))
      console.log(asyncRoute)
    }
  }
}
</script>

<style></style>
