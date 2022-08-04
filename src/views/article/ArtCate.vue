<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addVisible = true">添加分类</el-button>
      </div>
      <el-table style="width: 100%" :data="cateList" border stripe>
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="editCate(scope.row)">修改</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog :title="isEdit ? '编辑文章分类' : '添加文章分类'"
               :visible.sync="addVisible" width="35%" @close="addCloesClear">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="offDown">取 消</el-button>
        <el-button size="mini" type="primary" @click="addArtCate">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getArtCateListAPI } from '@/api'
  import { addArtCateAPI } from '@/api'
  import { editArtCateAPI } from '@/api'

  export default {
    name: 'ArtCate',
    data () {
      return {
        cateList: [],
        addVisible: false,
        addForm: { // 添加表单的数据对象
          cate_name: '',
          cate_alias: ''
        },
        addRules: { // 添加表单的验证规则对象
          cate_name: [
            {
              required: true,
              message: '请输入分类名称',
              trigger: 'blur'
            },
            {
              pattern: /^\S{1,10}$/,
              message: '分类名必须是1-10位的非空字符',
              trigger: 'blur'
            }
          ],
          cate_alias: [
            {
              required: true,
              message: '请输入分类别名',
              trigger: 'blur'
            },
            {
              pattern: /^[a-zA-Z0-9]{1,15}$/,
              message: '分类别名必须是1-15位的字母数字',
              trigger: 'blur'
            }
          ]
        },
        editId: '', // 要修改的文章id
        isEdit: false // 保存编辑状态(false新增, true编辑)
      }
    },
    created () {
      this.getArtCateList()
    },
    methods: {
      async getArtCateList () {
        const { data: res } = await getArtCateListAPI()
        this.cateList = res.data
      },
      offDown () {
        this.addVisible = false
      },
      addCloesClear () {
        this.$refs.addRef.resetFields()
      },
      addArtCate () {
        this.$refs.addRef.validate(async valid => {
          if (valid) {
            if (this.isEdit) {
              this.addForm.id = this.editId
              const { data: res} = await editArtCateAPI(this.addForm)
              if(res.code !== 0) {
                return this.$message.error('更新分类失败')
              }
                this.$message.success('更新分类成功')
            } else {
              const { data: res } = await addArtCateAPI(this.addForm)
              if (res.code !== 0) {
                return this.$message.error('添加分类失败')
              }
              this.$message.success('添加分类成功')
            }

            this.getArtCateList()
            this.idEdit = false
            this.editId = ''
            this.addVisible = false
          } else {
            return false
          }
        })
      },
      editCate (cateObj) {
        this.isEdit = true
        this.editId = cateObj.id
        this.addVisible = true
        this.addForm.cate_name = cateObj.cate_name
        this.addForm.cate_alias = cateObj.cate_alias
      }

    }
  }
</script>

<style lang="less" scoped>
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
