<template>
  <div class="reg-container">
    <div class="reg-box">
      <div class="title-box"></div>
      <el-form ref="regRef" :model="regFrom" :rules="regRules">
        <el-form-item prop="username">
          <el-input type="text" placeholder="请输入用户名" v-model="regFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="regFrom.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请确认输入密码" v-model="regFrom.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerFn" class="btn-reg">注册</el-button>
          <el-link type="info" class="login" @click="login">登陆></el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { registerAPI } from '@/api'

  export default {
    name: 'index',
    data() {
      const samePwd = (rule, value, callback) => {
        if(value !== this.regFrom.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        regFrom: {
          username: '',
          password: '',
          repassword: ''
        },
        regRules: {
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
          repassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: samePwd, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      registerFn() {
        //校验
        this.$refs.regRef.validate(async valid => {
          if(valid) {
            const { data: res } = await registerAPI(this.regFrom)
            if(res.code !== 0) {
              return this.$message.error(res.message)
            }
            this.$message.success(res.message)
            this.$router.push('/login')
          } else {
            return false
          }
        })
      },
      login() {
        this.$router.push('/login')
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
      height: 335px;
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
