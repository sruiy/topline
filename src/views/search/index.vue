<template>
  <div class="search">
    <form action="/">
        <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @cancel="onCancel"
        @search="onSearch(searchText)"
        >
            <div slot="action" @click="$router.back()">取消</div>
        </van-search>
    </form>
    <van-cell-group v-if="searchText">
        <van-cell
        icon="search"
        v-for="item in suggestion"
        :key="item"
        @click="onSearch(item)"
        >
            <div slot="title" v-html="highLight(item)"></div>
        </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isDelShow">
        <span style="margin-right: 10px;" @click="historyList=[]">全部删除</span>
        <span @click="isDelShow=false">完成</span>
        </template>
        <van-icon
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          v-else
          @click="isDelShow=true"
        />
      </van-cell>
      <van-cell
      :title="value"
      v-for="(value,index) in historyList"
      :key="value"
      @click="onSearch(value)"
      >
        <van-icon
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          v-show="isDelShow"
          @click.stop="historyList.splice(index,1)"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { setItem, getItem } from '@/utils/storage'
import { debounce } from 'lodash'

export default {
  name: 'search',
  data () {
    return {
      searchText: '',
      suggestion: [],
      historyList: getItem('history') || [],
      isDelShow: false
    }
  },
  watch: {
    // 联想关键词
    searchText: debounce(async function (newVal) {
      if (!newVal.length) {
        return
      }
      const { data } = await getSearchSuggestion(newVal)
      const options = data.data.options

      this.suggestion = options
    }, 1000),

    historyList (newVal) {
      setItem('history', newVal)
    }
  },
  methods: {
    onSearch (q) {
      if (!q.trim().length) {
        return
      }

      //   // 记录历史记录
      this.setHistory(q)
      //   if (!this.historyList.includes(q)) {
      //     this.historyList.unshift(q)
      //   } else {
      //     const index = this.historyList.findIndex(item => {
      //       return item.trim().toLowerCase() === q.trim().toLowerCase()
      //     })
      //     if (index !== -1) {
      //       this.historyList.splice(index, 1)
      //       this.historyList.unshift(q)
      //     }
      //   }
      //   setItem('history', this.historyList)

      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    },

    setHistory (q) {
      if (!this.historyList.includes(q)) {
        this.historyList.unshift(q)
      } else {
        const index = this.historyList.findIndex(item => {
          return item.trim().toLowerCase() === q.trim().toLowerCase()
        })
        if (index !== -1) {
          this.historyList.splice(index, 1)
          this.historyList.unshift(q)
        }
      }
      setItem('history', this.historyList)
    },
    onCancel () {},
    highLight (str) {
      let reg = new RegExp(this.searchText, 'gi')
      return str.replace(reg, `<span style="color:red">${this.searchText}</span>`)
    }
  }

}
</script>

<style>

</style>
