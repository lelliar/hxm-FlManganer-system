<template>
  <div>
    <div class="top">
      <div class="top-title">物料管理</div>
      <el-button type="primary" style="margin-left: 20px" @click="addWare">新增</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <Table :table="table"></Table>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope" style="display: flex">
          <el-button @click.native.prevent="changeRow(scope.row)" type="text">修改</el-button>
          <el-button @click.native.prevent="deleteRow(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- :hide-on-single-page="true" -->
    <el-pagination
      layout="prev, pager, next"
      :total="pageTotal"
      :page-size="pageSzie"
      @current-change="pageChange"
      class="pageCurrent"
    >
    </el-pagination>
    <el-dialog :title="`${titleName}物料`" :visible.sync="dialogFormVisible" destroy-on-close>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="物料编号" :label-width="formLabelWidth" prop="materialNumber">
          <el-input v-model="form.materialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物料名称：" :label-width="formLabelWidth" prop="materialName">
          <el-input v-model="form.materialName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@com/table.vue'
import { changeData, getDataByPage, deleteData, addData } from '@sev/commonRequest'
export default {
  name: 'Machine',
  components: {
    Table
  },
  data() {
    return {
      pageSzie: 10, // 每页显示多少条,
      pageTotal: 12, // 总条数
      nowPageData: 1, // 当前第几页
      titleName: '修改',
      formLabelWidth: '120px',
      form: {
        materialId: 123,
        materialNumber: '123',
        materialName: 'wefas'
      },
      dialogFormVisible: false, // dio显示隐藏
      rules: {
        materialNumber: [{ required: 'true', message: '请输入物料编号', trigger: 'blur' }],
        materialName: [{ required: 'true', message: '请输入物料名称', trigger: 'blur' }]
      },
      table: [
        {
          name: '物料名称',
          prop: 'materialName',
          width: '650'
        },
        {
          name: '物料编号',
          prop: 'materialNumber',
          width: '600'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.getPageData()
  },
  methods: {
    pageChange(val) {
      this.nowPageData = val
      this.getPageData()
    },
    // 新增
    addWare() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.titleName = '新增'
      this.dialogFormVisible = true
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 修改
        const { materialId, materialNumber, materialName } = this.form

        if (this.form.materialId) {
          changeData('/material/modify', {
            materialId,
            materialNumber,
            materialName
          }).then(() => {
            this.dialogFormVisible = false
            this.getPageData()
          })
        } else {
          addData('/material/add', {
            materialNumber,
            materialName
          }).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogFormVisible = false
            this.getPageData()
          })
        }
      })
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`你将删除${row.materialName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/material/remove/${row.materialId}`).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
    },
    // 分页请求
    getPageData() {
      getDataByPage('/material/page', {
        pageNum: this.nowPageData,
        pageSize: this.pageSzie
      }).then((res) => {
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        if (res.data.data.records.length == 0 && this.nowPageData != 1) {
          this.nowPageData--
          this.getPageData()
        }
      })
    },
    // 点击修改
    changeRow(row) {
      this.form = {}
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    }
  }
}
</script>

<style scoped lang="scss">
.pageCurrent {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(50%);
}
.top {
  width: 100%;
  height: 40px;
  display: flex;
  line-height: 40px;
  margin-bottom: 38px;
  justify-content: space-between;
  &-title {
    font-weight: bold;
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
  }
}
</style>
<style>
.el-main[data-v-7eb2bc79] {
  text-align: left;
}
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
  line-height: 40px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 55px;
  line-height: 55px;
}
</style>
