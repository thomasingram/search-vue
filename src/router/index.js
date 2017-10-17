import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

import Search from '../Search.vue'
import XEntity from '../XEntity.vue'

const routes = [
  {
    path: '/',
    component: Search
  },
  {
    path: '/search',
    component: Search,
    beforeEnter (to, from, next) {
      store.commit('SET_PREVIOUS_ROUTE', from)
      next()
    }
  },
  {
    path: '/search/xentity',
    name: 'xentity',
    component: XEntity
  },
  {
    path: '*',
    component: Search
  }
]

let options = {
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
}

if (store.state.searchInCaseFlow) {
  options.mode = 'hash'
} else {
  options.mode = 'history'
}

export default new Router(options)
