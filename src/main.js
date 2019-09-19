import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN'
import * as rules from 'vee-validate/dist/rules'

import {
  Cell,
  CellGroup,
  NavBar,
  Field,
  Button,
  Toast
} from 'vant'

Vue
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Toast)

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zh.messages[rule] // add its message
  })
}

extend('phone', {
  validate (value) {
    return /^[1]([3-9])[0-9]{9}$/.test(value)
  },
  message: '必须是手机号'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
