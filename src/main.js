// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import NProgress from 'vue-nprogress'

Vue.use(NProgress)

const nprogress = new NProgress({ parent: '.nprogress-container', showSpinner: false })

/* eslint-disable no-new */
var tsApp = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  nprogress
}).$mount('#app')

export default tsApp
