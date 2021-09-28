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
            <el-button @click.native.prevent="copyRow(scope.row)" type="text" size="small">
              复制
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
          {{ tgName }}
        </el-form-item>
        <el-form-item label="所属车间" :label-width="formLabelWidth" class="plantInput">
          {{ wareName }}
        </el-form-item>
        <el-form-item
          label="班组编号"
          class="plantInput"
          style="margin-top: 20px"
          :label-width="formLabelWidth"
          prop="teamSerialNumber"
        >
          <el-input v-model="form.teamSerialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="班组名称"
          class="plantInput"
          style="margin-top: 20px"
          :label-width="formLabelWidth"
          prop="teamName"
        >
          <el-input v-model="form.teamName" autocomplete="off"></el-input>
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
  name: 'ClassTable',
  components: {
    Table
  },
  // tgData 班组ID
  // wsData 车间ID
  props: ['dialogFormVisible', 'dioTitle', 'tgData', 'wareData'],
  data() {
    return {
      formLabelWidth: '120px',
      pageSize: 10, // 当前页数有多少条数据
      pageTotal: null, // 当前数据总条数
      nowPageData: 1, // 当前页为第几页
      wareName: '', // 所属厂区name
      tgName: '', // 所属车间Name
      form: {},
      rules: {
        teamSerialNumber: [{ required: 'true', message: '请输入班组编号', trigger: 'blur' }],
        teamName: [{ required: 'true', message: '请输入班组名称', trigger: 'blur' }]
      },
      table: [
        {
          name: '所属车间',
          prop: 'teamWorkShopName',
          width: '300'
        },
        {
          name: '班组编号',
          prop: 'teamSerialNumber',
          width: '300'
        },
        {
          name: '班组名称',
          prop: 'teamName',
          width: '300'
        },

        {
          name: '所属厂区',
          prop: 'teamPlantAreaName',
          width: '300'
        }
      ],
      tableData: []
    }
  },
  created() {
    this.getTableData(this.tgData)
  },
  watch: {
    tgData: function (newValue, oldValue) {
      this.getTableData(newValue)
    }
  },
  methods: {
    pageChange(e) {
      this.nowPageData = e
      this.getTableData(this.tgData)
    },
    // 关闭时清空
    closeDio(done) {
      this.$emit('changeDio', false)
      this.clearForm()
    },

    // 点击添加

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { teamId, teamSerialNumber, teamName } = this.form
          if (teamId) {
            changeData('/team/modify', {
              teamId: teamId,
              teamSerialNumber: teamSerialNumber,
              teamName: teamName,
              teamWorkShopId: this.tgData
            }).then(() => {
              this.$emit('changeDio', false)
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.form = {}
              this.getTableData(this.tgData)
            })
          } else {
            const { teamName, teamSerialNumber } = this.form
            addData('/team/add', {
              teamSerialNumber: teamSerialNumber,
              teamName: teamName,
              teamWorkShopId: this.tgData,
              teamPlantAreaName: this.wareData
            }).then(() => {
              this.$emit('changeDio', false)
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.form = {}
              this.getTableData(this.tgData)
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
    getTableData(tgId) {
      getData('/team/page', {
        pageSize: this.pageSize,
        pageNum: this.nowPageData,
        teamWorkShopId: tgId
      }).then((res) => {
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        if (res.data.data.records.length == 0 && this.nowPageData != 1) {
          this.nowPageData--
          this.getTableData(this.tgData)
        }
      })
      // 查询对应厂区name

      getByIdData(`/plantArea/info/${this.wareData}`).then((res) => {
        this.tgName = res.data.data.paName
      })
      // 查询对应车间name

      getByIdData(`/workShop/info/${this.tgData}`).then((res) => {
        this.wareName = res.data.data.wsName
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
      this.$confirm(`你将删除${row.teamName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/team/remove/${row.teamId}`).then(() => {
            this.getTableData(this.tgData)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
    },
    // 复制
    copyRow(row) {
      this.$emit('changeDioTitle', '复制')
      this.$emit('changeDio', true)
      this.form = JSON.parse(JSON.stringify(row))
      delete this.form.teamId
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
