<template>
    <div class="search-result">
        <van-nav-bar
        :title="`${$route.params.q} 的搜索结果`"
        left-arrow
        @click-left="$router.back()"
        fixed
        />
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell
            v-for="item in list"
            :key="item.aut_id"
            :title="item.title"
        />
        </van-list>
    </div>
</template>

<script>
import { getSearchArticle } from '@/api/search'

export default {
  name: 'search-result',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getSearchArticle({
        page: this.page,
        perPage: 20,
        q: this.$route.params.q
      })
      console.log(data)
      const { results } = data.data
      this.list.push(...results)
      this.loading = false

      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}

</script>

<style lang="less" scoped>
.search-result{
   /deep/ .van-list{
        margin-top: 46px
    }
    .van-icon {
      color: #fff
    }
}
</style>
