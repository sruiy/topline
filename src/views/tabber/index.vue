<template>
<div class="tabber">

  <router-view />

  <van-tabbar>
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="comment-o">问答</van-tabbar-item>
    <van-tabbar-item icon="video-o">视频</van-tabbar-item>
    <van-tabbar-item icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</div>
</template>

<script>
export default {}
</script>

<style>
</style>
