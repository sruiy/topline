<template>
  <div>
    <van-cell class="comment-title" :title="totalCount+'条回复'" size="large" />
    <van-cell>
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

    <van-cell title="全部评论"></van-cell>
    <!-- 回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.com_id.toString()"
        :title="item.content"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate | relativeDate}}</span>
            <van-button size="mini" type="default">回复</van-button>
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
  </div>
</template>

<script>
import { getComments, addComment } from '@/api/comment'

export default {
  name: 'replyComment',
  props: ['articleId', 'comment'],
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      commentText: '',
      totalCount: 0
    }
  },

  created () {

  },

  methods: {
    async onLoad () {
      const { data } = await getComments({
        type: 'c',
        source: this.comment.com_id.toString(),
        offset: this.offset,
        limit: this.limit
      })
      this.list.push(...data.data.results)
      this.totalCount = data.data.total_count
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
        target: this.comment.com_id.toString(),
        content: this.commentText,
        artId: this.articleId
      })
      // console.log(data)
      this.list.unshift(data.data.new_obj)
      this.commentText = ''
      this.totalCount++
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
.comment-title {
  text-align: center;
}
</style>
