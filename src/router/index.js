import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '@/views/home'
import Tabber from '@/views/tabber'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/articles'
import My from '@/views/my'
import UserEdit from '@/views/user-edit'
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

        },
        {
          name: 'my',
          path: '/my',
          component: My

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
    },
    {
      name: 'article',
      path: '/article/:articleId',
      component: Article
    },
    {
      name: 'user-edit',
      path: '/user',
      component: UserEdit
    }
  ]
})
export default router
