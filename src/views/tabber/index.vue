<template>
<div class="tabber">

  <router-view />

  <van-tabbar route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="comment-o">问答</van-tabbar-item>
    <van-tabbar-item icon="video-o">视频</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/my">{{$store.state.userInfo ? '我的' : '未登录'}}</van-tabbar-item>
  </van-tabbar>
</div>
</template>

<script>
export default {}
</script>

<style>
</style>
