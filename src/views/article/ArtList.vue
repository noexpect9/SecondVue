<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>

        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->

      <!-- 发表文章的 Dialog 对话框 -->
      <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose"
                 @change="offDialog">
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
    </el-card>
  </div>
</template>

<script>
  import { getArtCateListAPI } from '@/api'
  import defaultImg from '@/assets/images/cover.jpg'

  export default {
    name: 'ArtList',
    data () {
      return {
        // 查询参数对象
        q: {
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
        this.$refs.pubFormRef.validate(valid => {
          // 判断文章内容
          if (!valid) return this.$message.error('请填写文章信息')
          // 判断文章封面
          if (!this.pubForm.cover_img) return this.$message.error('请上传文章封面')
          console.log(this.pubForm)
        })
      },
      offDialog() {

      },
    },
    created () {
      this.getArtCateList()
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
</style>
