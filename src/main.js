import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueProgressBar from 'vue-progressbar'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/theme/currency.scss'

Vue.use(ElementUI)

const options = {
  color: 'rgba(255, 0, 0, 0.521)',
  failedColor: '#874b4b',
  thickness: '3px',
  height: '4px;',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 1200
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

// if (window.location.href != 'http://192.168.0.33:8082/#/login') {
//   const asyncRoute = JSON.parse(localStorage.getItem('asyncRoutes'))
//   const userInfo = JSON.parse(localStorage.getItem('userInfo'))
//   store.commit('setRoutes', asyncRoute)
//   store.commit('setAsyncRoute', asyncRoute)
//   store.commit('setUserInfo', userInfo)
//   store.commit('updateAsyncRoute')
// }
Vue.use(VueProgressBar, options)
Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
