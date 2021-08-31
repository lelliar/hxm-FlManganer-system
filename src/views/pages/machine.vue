<template>
  <div>
    <div class="top">
      <div class="top-title">自助机管理</div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <Table :table="table"></Table>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope" style="display: flex">
          <el-button @click.native.prevent="stopRow(scope.row)" type="text">
            {{ scope.row.ofStatus ? '停用' : '启用' }}
          </el-button>
          <el-button @click.native.prevent="changeRow(scope.row)" type="text">修改</el-button>
          <el-button @click.native.prevent="deleteRow(scope.row)" type="text">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- :hide-on-single-page="true" -->
    <el-pagination
      layout="prev, pager, next"
      :total="pageTotal"
      :page-size="pageSize"
      @current-change="pageChange"
      class="pageCurrent"
    >
    </el-pagination>
    <el-dialog :title="`${titleName}自助机`" :visible.sync="dialogFormVisible" destroy-on-close>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="自助机名称：" :label-width="formLabelWidth" prop="ofNumber">
          <el-input v-model="form.ofNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="自助机IP：" :label-width="formLabelWidth">
          {{ form.ofIp }}
        </el-form-item>
        <el-form-item label="绑定PLC：" :label-width="formLabelWidth" prop="ofPlcId">
          <el-select v-model="form.ofPlcId" clearable placeholder="请选择PLC">
            <el-option
              v-for="(item, i) in plcAll"
              :label="item.label"
              :value="item.value"
              :key="i"
            ></el-option>
          </el-select>
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
import { changeData, getData, getDataByPage, deleteData, getByIdData } from '@sev/commonRequest'
export default {
  name: 'Machine',
  components: {
    Table
  },
  data() {
    return {
      pageSize: 10, // 每页显示多少条,
      pageTotal: 12, // 总条数
      nowPageData: 1, // 当前第几页
      titleName: '修改',
      formLabelWidth: '120px',
      form: {},
      plc: [], // 所有PLC
      dialogFormVisible: false, // dio显示隐藏
      rules: {
        ofNumber: [{ required: 'true', message: '请输入编号', trigger: 'blur' }],
        ofPlcId: [{ required: 'true', message: '请选择PLC', trigger: 'blur' }]
      },
      table: [
        {
          name: '对应PLC名称',
          prop: 'ofPlcName',
          width: '250'
        },
        {
          name: '自助机名称',
          prop: 'ofNumber',
          width: '220'
        },
        {
          name: '绑定状态',
          prop: 'sortItems',
          width: '200'
        },
        {
          name: '自助机IP',
          prop: 'ofIp',
          width: '250'
        },
        {
          name: '使用状态',
          prop: 'useStatus',
          width: '200'
        },
        {
          name: '所属仓库',
          prop: 'ofWarehouseName',
          width: '250'
        }
      ],
      tableData: [],
      plcAll: []
    }
  },
  created() {
    this.getPageData()
    this.getPLC()
  },
  methods: {
    pageChange(val) {
      this.nowPageData = val
      this.getPageData()
    },
    // 解绑
    deleteRow(row) {
      this.$confirm(`你将解除与${row.ofPlcName}绑定, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/operatingFloor/unlinkPlc/${row.ofId}`).then(() => {
            this.$message({
              type: 'success',
              message: '解绑成功'
            })
            this.getPLC()
            this.getPageData()
          })
        })
        .catch(() => {})
    },
    // 修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.form.ofIp) {
          const { ofNumber, ofId, ofPlcId, ofWarehouseId } = this.form
          changeData('/operatingFloor/modify', {
            ofNumber: ofNumber,
            ofId: ofId,
            ofPlcId: ofPlcId,
            ofWarehouseId: ofWarehouseId
          }).then(() => {
            this.dialogFormVisible = false
            this.getPLC()
            this.getPageData()
          })
        } else {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
          return false
        }
      })
    },
    // 分页请求
    getPageData() {
      getDataByPage('/operatingFloor/page', {
        pageNum: this.nowPageData,
        pageSize: this.pageSize
      }).then((res) => {
        this.tableData = res.data.data.records.map((item) => {
          item.sortItems = item.ofPlcId ? '已绑定' : '未绑定'
          return item
        })
        this.pageTotal = res.data.data.total
        this.pageSize = res.data.data.size
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
    },
    // 启用/停用自助机
    stopRow(row) {
      this.$confirm(`你将${row.ofStatus ? '停用' : '启用'}${row.ofIp}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getData('/operatingFloor/startAndStop', { ofId: row.ofId, ofStatus: !row.ofStatus }).then(
            (res) => {
              this.$message({
                type: 'success',
                message: '成功'
              })
              this.getPLC()
              this.getPageData()
            }
          )
        })
        .catch(() => {})
    },

    // 查询所有PLC
    getPLC() {
      getByIdData('/plcDetailed/findBind').then((res) => {
        this.plc = res.data.data.map((item) => {
          return { label: item.plcdName, value: item.plcdId }
        })
      })
      getDataByPage('/plcDetailed/page', { pageNum: 1, pageSize: 999 }).then((res) => {
        this.plcAll = res.data.data.records.map((item) => {
          return { label: item.plcdName, value: item.plcdId }
        })
      })
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
  margin-bottom: 30px;
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
</style>
