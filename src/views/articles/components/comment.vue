<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="comment in list"
        :key="comment.com_id.toString()"
        :title="comment.content"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="comment.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{comment.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{comment.pubdate | relativeDate}}</span>
            <van-button size="mini" type="default" @click="onReply(comment)">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>

    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model="commentText"
      >
        <van-button
        slot="button"
        size="mini"
        type="info"
        @click="onComment"
        >发布</van-button>
      </van-field>
    </van-cell-group>
    <van-popup
      v-model="isReplyShow"
      round
      closeable
      position="bottom"
      :style="{ height: '95%' }"
    >
    <!-- 销毁之前的回复评论列表的缓存 -->
    <reply-list
    v-if="isReplyShow"
    :comment="currentComment"
    :article-id="ArticleId"
     />
    </van-popup>
  </div>
</template>

<script>
import { getComments, addComment } from '@/api/comment'
import replyList from './reply'

export default {
  name: 'ArticleComment',
  components: {
    replyList
  },
  props: ['ArticleId'],
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      commentText: '',
      isReplyShow: false,
      currentComment: {}
    }
  },

  created () {
  },

  methods: {
    onReply (comment) {
      this.isReplyShow = true
      this.currentComment = comment
    },
    async onLoad () {
      const { data } = await getComments({
        type: 'a',
        source: this.ArticleId,
        offset: this.offset,
        limit: this.limit
      })
      this.list.push(...data.data.results)
      this.loading = false
      if (data.data.last_id) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    async onComment () {
      const commentText = this.commentText.trim()
      if (!commentText.length) {
        return
      }
      const { data } = await addComment({
        target: this.ArticleId,
        content: this.commentText
      })
      // console.log(data)
      this.list.unshift(data.data.new_obj)
      this.commentText = ''
    }
  }
}
</script>

<style scoped lang='less'>
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
.van-popup{
  /deep/ .van-popup__close-icon {
    left: 10px
  }
}
</style>
