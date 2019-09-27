<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-text="返回"
      left-arrow
      right-text="保存"
      @click-left="$router.back()"
      @click-right="onSave"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click="changeImg">
        <van-image
          round
          width="30"
          height="30"
          :src="userProfile.photo"
        />
      </van-cell>
      <van-cell title="昵称" @click="isShowName=true" :value="userProfile.name" is-link />
      <van-cell title="性别" @click="isGenderShow=true" :value="userProfile.gender === 0 ? '男' : '女'" is-link />
      <van-cell title="生日" @click="isDateShow=true" :value="userProfile.birthday" is-link />
    </van-cell-group>

    <!-- file文件 -->
    <input type="file" hidden ref="file">

    <van-dialog
    v-model="isShowName"
    title="用户昵称"
    show-cancel-button
    @confirm="userProfile.name = inputName"
    >
        <van-field @input="onUserName" :value="userProfile.name" placeholder="请输入用户名" />
    </van-dialog>

    <van-action-sheet
    v-model="isGenderShow"
    :actions="[
        { name: '男',value:0 },
        { name: '女',value:1 }
      ]"
    cancel-text="取消"
    @select="onSelect"
    />

    <van-popup
    v-model="isDateShow"
    position="bottom"
    :style="{ height: '30%' }"
    >
        <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @cancel="isDateShow = false"
        @confirm="onDate"
        />
    </van-popup>

  </div>
</template>

<script>
import { UserEdit, UserImg, UserProfile } from '@/api/user'
import { formatDate } from '@/utils/date'
export default {
  name: 'UserEdit',
  data () {
    return {
      userProfile: {},
      isShowName: false,
      inputName: '',
      isGenderShow: false,
      currentDate: new Date(),
      isDateShow: false,
      minDate: new Date(1900, 0, 1)
    }
  },
  computed: {
    file () {
      return this.$refs.file
    }
  },
  mounted () {
    this.file.onchange = () => {
      this.userProfile.photo = window.URL.createObjectURL(this.file.files[0])
    }
  },

  created () {
    this.loadUserProfile()
  },

  methods: {
    onDate (value) {
      this.userProfile.birthday = formatDate(value)
      //   console.log(this.userProfile.birthday)
      this.isDateShow = false
    },
    async loadUserProfile () {
      const { data } = await UserEdit()
      this.userProfile = data.data
    },
    changeImg () {
      this.file.click()
    },

    async onSave () {
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })
      try {
        const photo = this.file.files[0]
        if (photo) {
          await UserImg(this.file.files[0])
        }
        await UserProfile(this.userProfile)
        toast.clear()
        this.$toast.success('保存成功')
      } catch (err) {
        // console.dir(err)
        toast.clear()
        if (err.response && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        } else {
          this.$toast.fail('保存失败')
        }
      }
    },
    onUserName (value) {
      this.inputName = value
    },
    onSelect (item) {
      //   console.log(item)
      this.userProfile.gender = item.value
      this.isGenderShow = false
    }
  }
}
</script>
