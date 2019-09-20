<template>
  <div class="login">
    <van-nav-bar title="登录" />
    <ValidationObserver tag="form" ref="loginForm">
      <van-cell-group>
        <ValidationProvider rules="required|phone" name="手机号" v-slot="{ errors }" tag="div">
          <van-field :error-message="errors[0]" v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
        </ValidationProvider>
        <ValidationProvider rules="required" name="验证码" v-slot="{ errors }" tag="div" >
        <van-field :error-message="errors[0]" v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" required />
       </ValidationProvider>
      </van-cell-group>
    </ValidationObserver>
    <div class="login-btn">
      <van-button
        @click="login"
        :loading="loading"
        type="info"
        size="large"
        color="linear-gradient(to right, #4bb0ff, #6149f6)"
      >登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      loading: false
    }
  },
  methods: {
    async login () {
      try {
        const isValid = await this.$refs.loginForm.validate()
        if (!isValid) {
          // this.$toast.fail('手机或验证码错误')
          return
        }
        // debugger
        this.loading = true
        const res = await login(this.user)
        console.log(res)
        this.$store.commit('setToken', res.data.data)
        this.loading = false
        this.$toast.success('登陆成功')
        this.$router.push('/home')
      } catch (err) {
        // console.log(err)
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机或验证码错误')
        }
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn {
  padding: 20px;
}
</style>
