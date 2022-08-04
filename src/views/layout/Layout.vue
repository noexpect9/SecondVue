<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" class="logo"/>
      <span class="logoFont">后台管理系统</span>
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF" logo
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img :src="user_pic" alt="" class="avatar"/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoOut"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic"/>
          <img src="../../assets/images/logo.png" alt="" v-else/>
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 左侧导航菜单 -->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <template v-for="item in menusList">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item v-if="!item.children" :index="item.indexPath" :key="item.indexPath"
            ><i class="el-icon-s-home"></i>{{item.title}}
            </el-menu-item
            >
            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="items in item.children" :index="items.indexPath" :key="items.indexPath"
              ><i :class="items.icon"></i>
                <span>{{items.title}}</span>
              </el-menu-item
              >
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <!--<el-footer>© www.itheima.com - 黑马程序员</el-footer>-->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getMenusListAPI } from '@/api'

  export default {
    name: 'my-layout',
    computed: {
      ...mapGetters(['username', 'nickname', 'user_pic'])
    },
    data () {
      return {
        // 保存侧边栏数据
        menusList: []
      }
    },
    methods: {
      logoOut () {
        this.$confirm('是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //window.sessionStorage.clear()
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      async getMenusList () {
        const { data: res } = await getMenusListAPI()
        console.log(res)
        this.menusList = res.data
      },
    },
    created () {
      this.getMenusList()
    }
  }


</script>

<style lang="less" scoped>
  .main-container {
    height: 100%;

    .el-header,
    .el-aside {
      background-color: #23262e;
    }

    .el-header {
      padding: 0;
      display: flex;
      justify-content: space-between;
    }

    .el-main {
      overflow-y: scroll;
      background-color: #F2F2F2;
    }
  }

  .avatar {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    background-color: #fff;
    margin-right: 10px;
    object-fit: cover;
  }

  .logo {
    width: 61px;
    height: 56px;
  }

  .logoFont {
    color: #F2F2F2;
    left: 50px;
    position: absolute;
    line-height: 60px;
    margin-left: 20px;
    font-size: 25px;
  }

  .user-box {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    user-select: none;

    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 15px;
      object-fit: cover;
    }

    span {
      color: white;
      font-size: 12px;
    }

    // 侧边栏菜单的样式
    .el-aside {
      .el-submenu,
      .el-menu-item {
        width: 200px;
        user-select: none;
      }
    }
  }
</style>
