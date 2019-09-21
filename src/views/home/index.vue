<template>
  <div class="home">
    <van-nav-bar title="首页" :fixed="true" />

    <!--标签栏-->
    <van-tabs v-model="active" color="#3296fa">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!--文章列表-->
        <van-pull-refresh v-model="channel.pullLoading" @refresh="onRefresh">
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="item in channel.list"
              :key="item.art_id.toString()"
              :title="item.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in item.cover.images" :key="index">
                    <van-image :src="img" lazy-load height="80" />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ item.aut_name }}</span>
                    <span>{{ item.comm_count }}评论</span>
                    <span>{{ item.pubdate | relativeDate }}</span>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
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
        channel.pullLoading = false
      })
      // console.log(data)
      this.channels = data.data.channels
    },

    async onLoad () {
      // 异步更新数据
      const CerrentChannel = this.currentChannel
      const { data } = await getArticle({
        channelId: CerrentChannel.id,
        timestamp: CerrentChannel.timestamp || Date.now(),
        withTop: 1
      })
      console.log(data)
      const { pre_timestamp: preTimestamp, results } = data.data
      // console.log(CerrentChannel.list)
      CerrentChannel.list.push(...results)
      CerrentChannel.loading = false

      if (!preTimestamp) {
        CerrentChannel.finished = true
      } else {
        CerrentChannel.timestamp = preTimestamp
      }
    },

    async onRefresh () {
      const CerrentChannel = this.currentChannel
      const { data } = await getArticle({
        channelId: CerrentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      CerrentChannel.list.unshift(...data.data.results)
      CerrentChannel.pullLoading = false
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang="less" scoped>  //推荐使用局部样式加/deep/
.van-tabs {
  /deep/ .van-tabs__content{
    margin-bottom: 50px;
    margin-top: 90px;
  }
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 2;  //首页有一个z-index,要设置高一个层级

  }
}
.article-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .meta span {
    margin-right: 10px;
  }
}
</style>
