<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      @changeTable="changeTable"
      :planRules="planRules"
      :pageSize="pageSize"
      :pageBool="pageBool"
      :pageTotal="pageTotal"
      ref="allTable"
      @changepageBool="changepageBool"
      @deleteRow="deleteRow"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
import { deleteData, getDataByPage } from '@sev/commonRequest'
import { changeMonday } from '@/hooks/changeWeek'
export default {
  name: 'MaterialPlan',
  components: {
    AllTable
  },
  data() {
    return {
      dialogFormVisible: false,
      allTitleName: '计划列表',
      pageSize: 10,
      pageTotal: 10,
      // 是否是第一次选择
      pageBool: true,
      table: [
        {
          name: '厂区',
          prop: 'planPlantAreaName',
          width: '200'
        },
        {
          name: '计划名称',
          prop: 'planName',
          width: '100'
        },
        {
          name: '计划类型',
          prop: 'allPlanDateMsg',
          width: '100'
        },
        {
          name: '计划时间',
          prop: 'allPlanDate',
          width: '250'
        },
        {
          name: '所发物料',
          prop: 'planMaterialName',
          width: '100'
        },
        {
          name: '发料总量/公斤',
          prop: 'planTotalWeight',
          width: '120'
        },
        {
          name: '发料次数',
          prop: 'planNumber',
          width: '100'
        },
        {
          name: '已发次数',
          prop: 'planIssuedNumber',
          width: '100'
        },
        {
          name: '已发重量',
          prop: 'planIssuedNumber',
          width: '100'
        },
        {
          name: '剩余次数',
          prop: 'residueDegree',
          width: '100'
        },
        {
          name: '计划状态',
          prop: 'matrialStatusMsg',
          width: '100'
        },
        {
          name: '发料状态',
          prop: 'planStatusMsg',
          width: '100'
        }
      ],
      planRules: {
        planType: [{ required: 'true', message: '请选择计划类型', trigger: 'blur' }],
        planMonth: [{ required: 'true', message: '请选择月份', trigger: 'blur' }],
        planWeekNumber: [{ required: 'true', message: '请选择周数', trigger: 'blur' }],
        planDate: [{ required: 'true', message: '请选择日期', trigger: 'blur' }],
        planName: [{ required: 'true', message: '请输入计划名称', trigger: 'blur' }],
        planPlantId: [{ required: 'true', message: '请选择计划厂区', trigger: 'blur' }],
        planMaterialId: [{ required: 'true', message: '请选择所发物料', trigger: 'blur' }],
        planTotalWeight: [{ required: 'true', message: '请输入发料总量', trigger: 'blur' }],
        planNumber: [{ required: 'true', message: '请输入发料次数', trigger: 'blur' }]
      },
      tableData: []
    }
  },
  methods: {
    changepageBool(val) {
      this.pageBool = val
    },
    // 修改tableData
    changeTable(val) {
      val.records.map((item) => {
        if (item.planType == 0) {
          item.allPlanDateMsg = '月计划'
          item.allPlanDate = item.planMonth
        }
        if (item.planType == 1) {
          item.allPlanDateMsg = '周计划'
          item.allPlanDate = item.planWeekNumber
        }
        if (item.planType == 2) {
          item.allPlanDateMsg = '日计划'
          item.allPlanDate = item.planDate
        }
        // if()
        item.planStatusMsg = item.planStatus ? '启用' : '停用'
        item.matrialStatusMsg = item.planTotalWeight == 0 ? '已发' : '未发'
        item.residueDegree = Math.floor(item.planNumber - item.planIssuedNumber)

        changeMonday(item.planWeekNumber)
        return item
      })
      this.pageBool = true
      this.tableData = val.records
      this.pageTotal = val.total
    },
    deleteRow(row, pageData) {
      this.$confirm(`此操作将永久删除${row.planPlantAreaName}下的计划, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/plan/remove/${row.planId}`).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getPageData(this.pageSize, pageData)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分页请求
    getPageData(pageNum, pageSize) {
      getDataByPage('/plan/page', { pageNum: pageSize, pageSize: this.pageSize }).then((res) => {
        res.data.data.records.map((item) => {
          if (item.planType == 0) {
            item.allPlanDateMsg = '月计划'
            item.allPlanDate = item.planMonth
          }
          if (item.planType == 1) {
            item.allPlanDateMsg = '周计划'
            item.allPlanDate = item.planWeekNumber
          }
          if (item.planType == 2) {
            item.allPlanDateMsg = '日计划'
            item.allPlanDate = item.planDate
          }
          // if()
          item.planStatusMsg = item.planStatus ? '启用' : '停用'
          item.matrialStatusMsg = item.planTotalWeight == 0 ? '已发' : '未发'
          item.residueDegree = Math.floor(item.planNumber - item.planIssuedNumber)
          changeMonday(item.planWeekNumber)
          return item
        })
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        this.pageBool = true
        if (res.data.data.records.length == 0 && pageSize != 1) {
          this.nowPageData--
          this.getPageData(this.pageSize, this.nowPageData)
        }
      })
    }
  }
}
</script>
