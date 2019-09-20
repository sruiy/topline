<template>
  <div class="home">
    <van-nav-bar title="首页" />

    <!--标签栏-->
    <van-tabs v-model="active">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!--文章列表-->
        <van-list v-model="channel.loading" :finished="channel.finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in channel.list" :key="item.art_id.toString()" :title="item.title" />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getChannels } from '@/api/channels'
import { getArticle } from '@/api/article'
export default {
  name: 'home',
  data () {
    return {
      active: 0,
      channels: []
    }
  },
  computed: {
    currentChannel () {
      return this.channels[this.active]
    }
  },
  methods: {
    async getAllChannels () {
      const { data } = await getChannels()
      /***
       * 将频道数组添加以下几项
       */
      data.data.channels.forEach(channel => {
        channel.list = []
        channel.loading = false
        channel.finished = false
        channel.timestamp = null
      })
      console.log(data)
      this.channels = data.data.channels
    },

    async onLoad () {
      // 异步更新数据
      const CerrentChannel = this.currentChannel
      const { data } = await getArticle(
        { channelId: CerrentChannel.id,
          timestamp: CerrentChannel.timestamp || Date.now(),
          withTop: 1
        })
      // console.log(data)
      const { pre_timestamp: preTimestamp, results } = data.data
      console.log(CerrentChannel.list)
      CerrentChannel.list.push(...results)
      CerrentChannel.loading = false

      if (!preTimestamp) {
        CerrentChannel.finished = true
      } else {
        CerrentChannel.timestamp = preTimestamp
      }
    }

  },
  created () {
    this.getAllChannels()
  }
}

</script>

<style>

</style>
