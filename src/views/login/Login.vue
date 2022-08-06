<template>
  <div class="reg-container">
    <div class="reg-box">
      <div class="title-box"></div>
      <el-form ref="loginRef" :model="loginFrom" :rules="loginRules">
        <el-form-item prop="username">
          <el-input type="text" placeholder="请输入用户名" v-model="loginFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="loginFrom.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="btn-reg">登陆</el-button>
          <el-link type="info" class="login" @click="register">注册></el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { loginAPI } from '@/api'
  import { mapMutations} from 'vuex'

  export default {
    name: 'index',
    data() {
      return {
        loginFrom: {
          username: '',
          password: '',
        },
        loginRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur'},
            { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '4到16位(字母，数字，下划线，减号)', trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              pattern: /^\S{6,15}$/,
              message: '密码必须是6-15的非空字符',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    methods: {
      ...mapMutations(['updateToken']),
      login() {
        this.$refs.loginRef.validate(async valid => {
          if(valid) {
            const { data: res } = await loginAPI(this.loginFrom)
            if(res.code !== 0) {
              return this.$message.error(res.message)
            }
            this.$message.success(res.message)
            this.updateToken(res.token)
            // 跳转到布局页
            this.$router.push('/')
          } else {
            return false
          }
        })
      },
      register() {
        this.$router.push('/reg')
      }
    },
  }
</script>

<style lang="less" scoped>
  .reg-container {
    background: url("../../assets/images/2.png") center;
    background-size: cover;
    height: 100%;

    .reg-box {
      width: 400px;
      height: 276px;
      background: rgba(105,105,105,.3);
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 0 30px;
      box-sizing: border-box;

      .title-box {
        height: 60px;
        background: url("../../assets/images/login_title.png") center no-repeat;
      }

      .btn-reg {
        width: 100%;
      }

      .login {
        font-size: 14px;
      }
    }
  }
</style>
