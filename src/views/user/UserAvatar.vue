<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt=""/>
      <img v-else :src="avatar" class="the_img" alt="">

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="inputRef" @change="onFileChange"/>
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="upLoad">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>
<script>
  import { updateUserAvatarAPI } from '@/api'

  export default {
    name: 'UserAvatar',
    data () {
      return {
        avatar: '',
      }
    },
    methods: {
      chooseImg () {
        this.$refs.inputRef.click()
      },
      onFileChange (e) {  // 原生事件对象
        let files = e.target.files  // 得到用户选择文件的数组
        if (files.length === 0) {

        } else {
          // 1.将图片转为内存临时地址(无法传给后台)
          // this.avatar = URL.createObjectURL(files[0])
          // console.log(this.avatar)
          // 2.将图片转为base64字符串
          let fr = new FileReader()
          fr.readAsDataURL(files[0])
          fr.onload = (e) => {
            this.avatar = e.target.result
          }
        }
      },
      // 上传头像
      async upLoad() {
        const { data : res } = await updateUserAvatarAPI(this.avatar)
        if(res.code !== 0 ){
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        this.$store.dispatch('getUserInfoActions')
        console.log(res)
      },
    }
  }
</script>

<style lang="less" scoped>
  .btn-box {
    margin-top: 10px;
  }

  .preview {
    object-fit: cover;
  }

  .the_img {
    width: 350px;
    height: 350px;
  }
</style>
