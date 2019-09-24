import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '@/views/home'
import Tabber from '@/views/tabber'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { name: 'login',
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Tabber,
      children: [
        {
          name: 'home',
          path: '',
          component: Home

        }
      ]
    },
    {
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: SearchResult
    }
  ]
})
export default router
