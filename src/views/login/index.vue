<template>
  <div class="login">
    <van-nav-bar title="登录" />
    <ValidationObserver tag="form" ref="loginForm">
      <van-cell-group>
        <ValidationProvider rules="required|phone" name="手机号" v-slot="{ errors }" tag="form">
          <van-field :error-message="errors[0]" tag="div"  v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
        </ValidationProvider>
        <ValidationProvider rules="required" name="验证码" v-slot="{ errors }">
        <van-field :error-message="errors[0]" tag="div"  v-model="user.code" type="password" label="验证码" placeholder="请输入验证码" required />
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
import { login } from '../../api/user'
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
          return
        }
        this.loading = true
        const res = await login(this.user)
        if (res) {
          this.loading = false
        }
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
.van-nav-bar {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
}
.login-btn {
  padding: 20px;
}
</style>
