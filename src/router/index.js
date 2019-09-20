import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import home from '@/views/home'
import tabber from '@/views/tabber'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { name: 'login',
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: tabber,
      children: [
        {
          name: 'home',
          path: '',
          component: home

        }
      ]
    }
  ]
})
export default router
