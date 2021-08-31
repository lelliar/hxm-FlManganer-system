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
Vue.use(VueProgressBar, options)
Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
