<template>
    <div class="article-container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <van-loading class="article-loading" v-if="loading"/>
    <!-- 文章详情 -->
    <div class="detail" v-else-if="article.title">
        <h3 class="title">{{article.title}}</h3>
        <div class="author">
            <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
            <div class="text">
                <p class="name">{{article.aut_name}}</p>
                <p class="time">{{article.pubdate | relativeDate}}</p>
            </div>
            <van-button
            round
            size="small"
            :type="article.is_followed ? 'default':'info'"
            @click="onfollow"
            >
            {{article.is_followed ? '已关注' : '+ 关注' }}
            </van-button>
    </div>
    <!-- 文章内容 -->
    <div class="content" v-html="article.content"></div>
        <div class="zan">
            <van-button
            round
            size="small"
            hairline
            :type="article.attitude ===1 ? 'default':'primary'"
            plain
            icon="good-job-o"
            @click="onLike"
            >{{article.attitude === 1 ? '取消点赞' : '点赞'}}</van-button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <van-button
            round
            size="small"
            hairline
            :type="article.attitude === 0 ? 'default' : 'danger'"
            plain
            icon="delete"
            @click="onDislike"
            >{{article.attitude === 0 ? '取消不喜欢' : '不喜欢'}}</van-button>
        </div>
    </div>
    <!-- 加载失败 -->
    <div class="error" v-else>
        <p>网络超时，点击 <a href="#" @click.prevent="loadArticle">刷新</a> 试一试。</p>
    </div>
    <article-comment :article-id="this.$route.params.articleId"></article-comment>
    </div>
</template>

<script>
import ArticleComment from './components/comment'
import {
  getArticleDetails,
  likeArticle,
  unLikeArticle,
  unDislike,
  dislike
} from '@/api/article'
import { userFollow, unUserFollow } from '@/api/user'

export default {
  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true,
      article: {

      }
    }
  },
  methods: {
    // 获取文章详细列表
    async getArticles () {
      this.loading = true
      // 不管是否错误,loading都要执行,所以要保证执行用try catch捕获错误
      try {
        const { data } = await getArticleDetails(this.$route.params.articleId)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 关注
    onfollow () {
      const { is_followed: isFollowed, aut_id: autId } = this.article
      if (isFollowed) {
        // 已关注状态,要取消关注
        unUserFollow(autId)
      } else {
        // 未关注状态,要关注
        userFollow(autId)
      }
      this.article.is_followed = !isFollowed
    },
    // 点赞
    onLike () {
      const { attitude } = this.article
      const articleId = this.article.art_id.toString()
      if (attitude === 1) {
        // 已点赞状态,要取消点赞
        unLikeArticle(articleId)
        this.article.attitude = -1
      } else {
        // 未点赞状态,要点赞
        likeArticle(articleId)
        this.article.attitude = 1
      }
    },
    // 不喜欢
    onDislike () {
      const { attitude } = this.article
      const articleId = this.article.art_id.toString()
      if (attitude === 0) {
        // 不喜欢状态,要取消不喜欢
        unDislike(articleId)
        this.article.attitude = -1
      } else {
        // 无态度状态,要不喜欢
        dislike(articleId)
        this.article.attitude = 0
      }
    }

  },
  created () {
    this.getArticles()
  }

}
</script>

<style scoped lang='less'>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
