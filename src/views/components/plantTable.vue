<template>
  <div>
    <div style="margin-top: 38px">
      <el-table :data="tableData" style="width: 100%" max-height="600">
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
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item label="所属厂区" :label-width="formLabelWidth" class="plantInput">
          {{ wareName }}
        </el-form-item>
        <el-form-item
          label="车间编号"
          class="plantInput"
          style="margin-top: 20px"
          :label-width="formLabelWidth"
          prop="wsSerialNumber"
        >
          <el-input v-model="form.wsSerialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="车间名称"
          class="plantInput"
          style="margin-top: 20px"
          :label-width="formLabelWidth"
          prop="wsName"
        >
          <el-input v-model="form.wsName" autocomplete="off"></el-input>
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
import { addData, changeData, deleteData, getData, getByIdData } from '@sev/commonRequest'
export default {
  name: 'PlantTable',
  components: {
    Table
  },
  props: ['dialogFormVisible', 'dioTitle', 'wareData'],
  data() {
    return {
      formLabelWidth: '120px',
      wareName: '', // 厂区名称
      pageSize: 10, // 当前页数有多少条数据
      pageTotal: 10, // 当前数据总条数
      nowPageData: 1, // 当前页为第几页
      form: {
        wsId: '',
        wsSerialNumber: '',
        plantArea: {
          paName: '',
          paId: ''
        },

        wsName: ''
      },
      rules: {
        wsName: [{ required: 'true', message: '请输入车间名称', trigger: 'blur' }],
        wsSerialNumber: [{ required: 'true', message: '请输入车间编号', trigger: 'blur' }]
      },
      table: [
        {
          name: '车间编号',
          prop: 'wsSerialNumber',
          width: '400'
        },
        {
          name: '车间名称',
          prop: 'wsName',
          width: '400'
        },
        {
          name: '所属厂区',
          prop: 'wsPlantAreaName',
          width: '400'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.getTableData(this.wareData)
  },
  watch: {
    wareData: function (newValue, oldValue) {
      this.getTableData(newValue)
    }
  },
  methods: {
    pageChange(e) {
      this.nowPageData = e
      this.getTableData(this.wareData)
    },
    closeDio(done) {
      this.$emit('changeDio', false)
      this.clearForm()
    },
    // 点击确认
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { wsSerialNumber, wsName, wsId } = this.form
          if (wsId) {
            changeData('/workShop/modify', {
              wsId: wsId,
              wsSerialNumber: wsSerialNumber,
              wsName: wsName,
              wsPlantArea: this.wareData
            }).then(() => {
              this.$emit('changeDio', false)
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$emit('getOption', this.wareData)
              this.form = {}
              this.getTableData(this.wareData)
            })
          } else {
            const { wsSerialNumber, wsName } = this.form
            addData('/workShop/add', {
              wsSerialNumber: wsSerialNumber,
              wsName: wsName,
              wsPlantArea: this.wareData
            }).then(() => {
              this.$emit('changeDio', false)
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.$emit('getOption', this.wareData)
              this.form = {}
              this.getTableData(this.wareData)
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

    // 点击修改
    changeRow(row) {
      this.$emit('changeDioTitle', '修改')
      this.form = {}
      this.$emit('changeDio', true)
      this.form = JSON.parse(JSON.stringify(row))
    },

    // 请求对应页面数据
    getTableData(val) {
      getData('/workShop/page', {
        pageSize: this.pageSize,
        pageNum: this.nowPageData,
        wsPlantArea: val
      }).then((res) => {
        this.form = {}
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        if (res.data.data.records.length == 0 && this.nowPageData != 1) {
          this.nowPageData--
          this.getTableData(val)
        }
      })
      // 查询对应厂区name
      getByIdData(`/plantArea/info/${this.wareData}`).then((res) => {
        this.wareName = res.data.data.paName
      })
    },

    // 取消时清空
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.clearForm()
      this.$emit('changeDio', false)
    },
    // 清空方法
    clearForm() {
      for (const key in this.form) {
        this.form[key] = ''
      }
    },
    // 点击删除
    deleteRow(row) {
      this.$confirm(`你将删除${row.wsName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/workShop/remove/${row.wsId}`).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableData(this.wareData)
            this.$emit('getOption', this.wareData)
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
}
</style>
