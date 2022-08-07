<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="page">
          <el-form-item label="文章分类">
            <el-select v-model="page.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="item in cateList" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="page.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="filterCateName">筛选</el-button>
            <el-button type="info" size="small" @click="resetData">重置</el-button>
          </el-form-item>

        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%" border stripe>
        <el-table-column prop="title" label="文章标题">
          <template v-slot="{row}">
            <el-link type="primary" @click="showDetail(row.id)">
              {{row.title}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="分类"></el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template v-slot="{row}">
            <span>{{$formatData(row.pub_date)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="primary" size="mini">修改</el-button>
            <el-button type="drange" size="mini" @click="delArticle(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="page.pagesize"
        layout="  sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
      <!-- 发表文章的 Dialog 对话框 -->
      <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose"
                 @closed="offDialog">
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
          <el-form-item label="文章标题" prop="title">
            <el-input type="text" v-model="pubForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="cate_id">
            <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
              <el-option v-for="item in cateList" :label="item.cate_name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <!-- 使用 v-model 进行双向的数据绑定 -->
            <quill-editor v-model="pubForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="文章封面">
            <!-- 展示封面图片 -->
            <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef"/>
            <br/>
            <!-- 文件选择框 默认隐藏 -->
            <input type="file" style="display: none" accept="image/*" ref="iptFileRef" @change="onCoverChange"/>
            <el-button type="text" @click="showImgFile">+ 选择封面</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="pubArtcle('已发布')">发布</el-button>
            <el-button type="info" @click="pubArtcle('暂存草稿')">存为草稿</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="showArtDetail" width="80%">
        <h1 class="title">{{artDetail.title}}</h1>
        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ $formatData(artDetail.pub_date) }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>
        <!-- 分割线 -->
        <el-divider></el-divider>
        <!-- 文章的封面 -->
        <img :src="baseURL + artDetail.cover_img" alt=""/>
        <!-- 文章详情 -->
        <div v-html="artDetail.content" class="detail-box"></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {
    getArtCateListAPI,
    addArticleAPI,
    getArticleListAPI,
    getArticleDetailsAPI,
    delArticleAPI
  } from '@/api'
  import defaultImg from '@/assets/images/cover.jpg'
  import { baseURL } from '@/utils/request'

  export default {
    name: 'ArtList',
    data () {
      return {
        // 查询参数对象
        page: {
          pagenum: 1,
          pagesize: 2,
          cate_id: '',
          state: ''
        },
        pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
        pubForm: { // 表单的数据对象
          title: '',
          cate_id: '',
          content: '', // 文章的内容
          cover_img: null,
          state: '',
        },
        pubFormRules: { // 表单的验证规则对象
          title: [
            {
              required: true,
              message: '请输入文章标题',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 30,
              message: '文章标题的长度为1-30个字符',
              trigger: 'blur'
            }
          ],
          cate_id: [{
            required: true,
            message: '请选择文章标题',
            trigger: 'blur'
          }],
          content: [
            {
              required: true,
              message: '请输入文章内容',
              trigger: 'blur'
            }
          ]
        },
        cateList: [],
        artList: [],
        total: 0,
        artDetail: {},
        showArtDetail: false,
        // 因为后台返回的图片地址只有后半段, 需要自己拼接前缀服务器地址, 也就是基地址
        baseURL
      }
    },
    methods: {
      showPubDialogFn () {
        this.pubDialogVisible = true
      },
      async handleClose (done) {
        // 询问用户是否确认关闭对话框
        const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 取消了关闭-阻止住, 什么都不干
        if (confirmResult === 'cancel') return
        // 确认关闭
        done()
      },
      async getArtCateList () {
        const { data: res } = await getArtCateListAPI()
        if (res.code === 0) {
          this.cateList = res.data
        }
      },
      showImgFile () {
        this.$refs.iptFileRef.click()
      },
      // 封面选择改变的事件
      onCoverChange (e) {
        // 获取用户选择的文件
        const files = e.target.files
        if (files.length === 0) {
          // 用户没有选择封面
          this.pubForm.cover_img = null
          this.$refs.imgRef.setAttribute('src', defaultImg)
        } else {
          // 用户选择了封面
          this.pubForm.cover_img = files[0]
          const url = URL.createObjectURL(files[0])
          this.$refs.imgRef.setAttribute('src', url)
        }
      },
      pubArtcle (state) {
        this.pubForm.state = state
        this.$refs.pubFormRef.validate(async (valid) => {
          // 判断文章内容
          if (!valid) return this.$message.error('请填写文章信息')
          // 判断文章封面
          if (!this.pubForm.cover_img) return this.$message.error('请上传文章封面')
          console.log(this.pubForm)
          // 创建FormData对象
          const fd = new FormData
          // 向FormData中追加数据
          Object.keys(this.pubForm).forEach((key) => {
            fd.append(key, this.pubForm[key])
          })

          // 发送请求
          const { data: res } = await addArticleAPI(fd)
          console.log(res)
          if (res.data === 0) {
            return this.$message.error('新增文章失败')
          }
          this.$message.success('新增文章成功')
          // 重新获取文章列表
          this.getArtCateList()
          this.pubDialogVisible = false
          // 获取文章列表
          this.getArticleList()
        })
      },
      // 关闭对话框 清空数据
      offDialog () {
        // 清空文章内容
        this.$refs.pubFormRef.resetFields()
        // 清空 content和文章封面
        this.pubForm.content = ''
        this.$refs.imgRef.setAttribute('src', defaultImg)
      },
      async getArticleList () {
        const { data: res } = await getArticleListAPI(this.page)
        if (res.code !== 0) return this.$message.error('获取失败')
        this.artList = res.data
        this.total = res.total
        console.log(this.artList)
        console.log(res)
      },
      handleSizeChange (newSize) {
        this.page.pagesize = newSize
        this.page.pagenum = 1
        this.getArticleList()
      },
      handleCurrentChange (newPage) {
        this.page.pagenum = newPage
        // 重新发起请求
        this.getArticleList()
      },
      filterCateName () {
        this.getArticleList()
      },
      resetData () {
        this.page = {
          pagenum: 1,
          pagesize: 2,
          cate_id: '',
          state: ''
        }
        this.getArticleList()
      },
      async showDetail (id) {
        const { data: res } = await getArticleDetailsAPI(id)
        if (res.code !== 0) return this.$message.error('获取失败')
        this.artDetail = res.data
        this.showArtDetail = true
        console.log(res)
      },
      async delArticle(id) {
        // 1. 询问用户是否要删除
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        // 2. 取消了删除
        if (confirmResult === 'cancel') return

        // 3.执行删除
        const {data:res } = await delArticleAPI(id)
        if(res.code !== 0) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getArticleList()
      }
    },
    created () {
      this.getArtCateList()
      this.getArticleList()
      console.log(this.artList)
    }
  }
</script>

<style lang="less" scoped>
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .btn-pub {
      margin-top: 5px;
    }
  }

  ::v-deep .ql-editor {
    min-height: 300px;
  }

  .el-pagination {
    margin-top: 15px;
  }

  .title {
    font-size: 24px;
    text-align: center;
    font-weight: normal;
    color: #000;
    margin: 0 0 10px 0;
  }

  .info {
    font-size: 12px;
    span {
      margin-right: 20px;
    }
  }

  // 修改 dialog 内部元素的样式，需要添加样式穿透
  ::v-deep .detail-box {
    img {
      width: 500px;
    }
  }
</style>
