<template>
  <div>
    <div style="margin-top: 38px">
      <el-table :data="tableData" style="width: 100%">
        <Table :table="table"></Table>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope" style="display: flex">
            <el-button @click.native.prevent="changeRow(scope.row)" type="text" size="small">
              修改
            </el-button>
            <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dioTitle"
      :visible.sync="dialogFormVisible"
      :before-close="closeDio"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item
          label="厂区编号"
          :label-width="formLabelWidth"
          class="plantInput"
          prop="paSerialNumber"
        >
          <el-input v-model="form.paSerialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="厂区名称"
          class="plantInput"
          style="margin-top: 20px"
          :label-width="formLabelWidth"
          prop="paName"
        >
          <el-input v-model="form.paName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      layout="prev, pager, next"
      :total="pageTotal"
      :page-size="pageSize"
      @current-change="pageChange"
      class="pageCurrent"
    >
    </el-pagination>
  </div>
</template>

<script>
import Table from '@com/table.vue'
import { addData, changeData, deleteData, getData } from '@sev/commonRequest'
export default {
  name: 'WareTable',
  components: {
    Table
  },
  props: ['dialogFormVisible', 'dioTitle'],
  data() {
    return {
      formLabelWidth: '120px',
      pageTotal: 20, // 总条数
      pageSize: 10, // 每页多少条
      nowPageData: 1, // 当前第几页
      form: {
        paId: '',
        paSerialNumber: '',
        paName: ''
      },
      rules: {
        paName: [{ required: 'true', message: '请输入厂区名称', trigger: 'blur' }],
        paSerialNumber: [{ required: 'true', message: '请输入厂区编号', trigger: 'blur' }]
      },
      table: [
        {
          name: '编号',
          prop: 'paSerialNumber',
          width: '600'
        },
        {
          name: '名称',
          prop: 'paName',
          width: '700'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.getTableData()
  },

  methods: {
    pageChange(e) {
      this.nowPageData = e
      this.getTableData()
    },
    closeDio() {
      this.$emit('changeDio', false)
      this.form = {}
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { paId, paSerialNumber, paName } = this.form
          if (paId) {
            changeData('/plantArea/modify', {
              paId: paId,
              paSerialNumber: paSerialNumber,
              paName: paName
            }).then((res) => {
              this.$emit('changeDio', false)
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.form = {}
              this.getTableData()
              this.$emit('getAllTableData')
            })
          } else {
            const { paSerialNumber, paName } = this.form
            addData('/plantArea/add', { paSerialNumber, paName }).then(() => {
              this.$emit('changeDio', false)
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.getTableData()
              this.form = {}
              this.$emit('getAllTableData')
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请检查输入是否正确'
          })
        }
      })
    },
    changeRow(row) {
      this.$emit('changeDioTitle', '修改')
      this.form = {}
      this.$emit('changeDio', true)
      this.form = JSON.parse(JSON.stringify(row))
    },
    getTableData() {
      const that = this
      getData('/plantArea/page', { pageNum: this.nowPageData, pageSize: this.pageSize }).then(
        (res) => {
          this.tableData = res.data.data.records
          this.pageTotal = res.data.data.total
          this.pageSize = res.data.data.size
          if (res.data.data.records.length == 0 && this.nowPageData != 1) {
            console.log('111')
            that.nowPageData--
            that.getTableData()
          }
        }
      )
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.$emit('changeDio', false)
    },
    deleteRow(row) {
      this.$confirm(`你将删除${row.paName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/plantArea/remove/${row.paId}`).then(() => {
            this.getTableData()
            this.$emit('getAllTableData')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
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
</style>
