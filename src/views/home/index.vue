<template>
  <div class="home">
    <van-nav-bar title="首页" :fixed="true">
      <!-- 自定义标题内容 -->
      <van-button
      class="search-btn"
      icon="search"
      size="small"
      round type="info"
      slot="title"
      @click="$router.push('/search')"
      >
      搜索
      </van-button>
    </van-nav-bar>

    <!--频道标签栏-->
    <van-tabs v-model="active" color="#3296fa" @change="lightHigh(active)">
      <div slot="nav-right" class="wap-nav" @click="isChannelsShow=true">
        <van-icon class="channelsEdit" name="wap-nav" size="24" />
      </div>
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
              @click="$router.push({
                name:'article',
                params: {
                  articleId:item.art_id.toString()
                }
              })"
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

    <!--编辑频道-->
    <van-popup
      v-model="isChannelsShow"
      round
      closeable
      position="bottom"
      :style="{ height: '95%' }"
    >

      <van-cell-group>
        <van-cell :border="false" title="我的频道" size="large">
          <van-button @click="isEdit = !isEdit" color="rgb(178, 60, 30)" plain size="mini" round>{{isEdit? '完成': '编辑'}}</van-button>
        </van-cell>
      <van-grid :gutter="10">
        <van-grid-item @click="onUserChannelsClick(channel,index)" v-for="(channel,index) in channels" :key="channel.id">
          <div slot="text" class="my-channels" :class="{focusColor:channel.toggleClass}">{{channel.name}}</div>
          <van-icon v-show="isEdit" class="close" slot="icon" name="close" />
        </van-grid-item>
      </van-grid>
      </van-cell-group>
    <van-cell-group>
        <van-cell :border="false" title="推荐频道" size="large">
        </van-cell>
      <van-grid :gutter="10">
        <van-grid-item @click="addChannels(channel)" v-for="channel in remainingChannels" :key="channel.id" :text="channel.name" />
      </van-grid>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { getUserOrDefaultChannel, getChannels, setUserChannels, delUserChannels } from '@/api/channels'
import { getArticle } from '@/api/article'
import { mapState } from 'vuex'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'home',
  data () {
    return {
      active: 0,
      channels: [],
      isChannelsShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    currentChannel () {
      return this.channels[this.active]
    },
    ...mapState(['userInfo']),

    // 获取剩余频道
    remainingChannels () {
      return this.allChannels.filter(channel => {
        // return this.channels.findIdex(item => channel.id === item.id) === -1
        return this.channels.find(item => channel.id === item.id) === undefined
      }
      )
    }
  },
  methods: {
    lightHigh (active) {
      this.channels.forEach(item => { item.toggleClass = false })
      this.channels[active].toggleClass = true
    },
    // 删除或切换频道
    async onUserChannelsClick (channel, index) {
      this.channels.forEach(item => { item.toggleClass = false })
      if (this.isEdit) {
        this.channels.splice(index, 1)
        if (this.userInfo) {
          await delUserChannels(channel.id)
        } else {
          setItem('channels', this.channels)
        }
      } else {
        this.active = index
        channel.toggleClass = true
        this.isChannelsShow = false
      }
    },
    // 添加频道
    async addChannels (channel) {
      if (this.userInfo) {
        this.channels.push(channel)
        const channles = []
        this.channels.slice(1).forEach((item, index) => {
          channles.push({
            id: item.id,
            seq: index + 2
          })
        })
        await setUserChannels(channles)
      } else {
        this.channels.push(channel)
        setItem('channels', this.channels)
      }
    },
    // 获取我的频道
    async getloadChannels () {
      // const { data } = await getChannels()
      let channels = []
      if (this.userInfo) {
        const { data } = await getUserOrDefaultChannel()
        channels = data.data.channels
      } else {
        if (getItem('channels')) {
          channels = getItem('channels')
        } else {
          const { data } = await getUserOrDefaultChannel()
          channels = data.data.channels
        }
      }
      // channels.forEach(channel => {
      //   channel.list = [] //
      //   channel.loading = false //
      //   channel.finished = false //
      //   channel.timestamp = null //
      //   channel.pullLoading = false
      //   channel.toggleClass = false //
      // })
      channels.forEach(channel => { // 遍历每项值不一样,所以调用封装函数不能在外面定义
        const extendData = this.addChannelData()
        Object.assign(channel, extendData)
      })
      // console.log(data)
      this.channels = channels
    },

    // 获取所有频道
    async getChannels () {
      const { data } = await getChannels()
      const channels = data.data.channels
      channels.forEach(channel => {
        const extendData = this.addChannelData()
        Object.assign(channel, extendData)
      })
      this.allChannels = channels
    },

    // 上划加载
    async onLoad () {
      // 异步更新数据
      const CerrentChannel = this.currentChannel
      const { data } = await getArticle({
        channelId: CerrentChannel.id,
        timestamp: CerrentChannel.timestamp || Date.now(),
        withTop: 1
      })
      // console.log(data)
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

    // 下拉刷新
    async onRefresh () {
      const CerrentChannel = this.currentChannel
      const { data } = await getArticle({
        channelId: CerrentChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      CerrentChannel.list.unshift(...data.data.results)
      CerrentChannel.pullLoading = false
      this.$toast('刷新完成')
    },

    /**
     * 将增加的频道属性数据封装成函数
     */
    addChannelData () {
      return {
        list: [],
        loading: false,
        finished: false,
        timestamp: null,
        pullLoading: false,
        toggleClass: false
      }
    }
  },
  created () {
    this.getChannels()
    this.getloadChannels()
  }
}
</script>

<style lang="less" scoped>
//推荐使用局部样式加/deep/
.van-tabs {
  /deep/ .van-tabs__content {
    margin-bottom: 50px;
    margin-top: 90px;
  }
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 2; //首页有一个z-index,要设置高一个层级
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
.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  // opacity: 0.8;
  color: #666;

}
.van-cell-group {
  margin-top: 50px;

}
.close {
position: absolute;
top: -5px;
right: -5px
}
.van-popup{
  /deep/ .van-popup__close-icon {
    left: 10px
  }
}
//搜索按钮
.search-btn {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  color: #fff
}
// .van-grid-item{
//   box-sizing: border-box;
//   margin: 10px 10px 0;
// }

.home {
  .van-icon-search.van-button__icon {
    color: #fff
  }
  .my-channels{
    font-size: 12px;
    color: #7d7e80
  }
  .focusColor {
  color: rgb(178, 60, 30)
}
}
</style>
