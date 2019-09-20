import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: getItem('user')
  },
  mutations: {
    setToken (state, user) {
      state.userInfo = user
      setItem('user', JSON.stringify(state.userInfo))
    }
  },
  actions: {

  }
})
