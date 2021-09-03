<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      @changeTable="changeTable"
      :planRules="planRules"
      ref="allTable"
      @deleteRow="deleteRow"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
import { deleteData } from '@sev/commonRequest'
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
      table: [
        {
          name: '厂区',
          prop: 'planPlantAreaName',
          width: '100'
        },
        {
          name: '计划名称',
          prop: 'planName',
          width: '150'
        },
        {
          name: '计划类型',
          prop: 'planType',
          width: '100'
        },
        {
          name: '计划时间',
          prop: 'planCreateTime',
          width: '150'
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
          prop: 'planTotalWeight',
          width: '100'
        },
        {
          name: '未发次数',
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
      tableData: [
        {
          planId: 123,
          planMonth: '2021-03',
          planWeekNumber: '2021-09-20',
          planDate: '2021-8-31',
          planName: '123',
          planPlantId: [['zujian', 'form']],
          planPlantAreaId: 13,
          planPlantAreaName: 'asd',
          planWorkShopId: 123,
          planWorkShopName: '12ds',
          planTeamGroupId: 213,
          planTeamGroupName: '213',
          planMaterialId: 1,
          planMaterialName: '213',
          planTotalWeight: '213',
          planNumber: '213',
          planIssuedNumber: '213',
          planCreateTime: '2021-08-30',
          planUpdateTime: '2021-08-30',
          planType: 1,
          planStatus: 1,
          residueDegree: 123
        },
        {
          planId: 123,
          planMonth: '2021-03',
          planWeekNumber: '2021-09-20',
          planDate: '2021-8-31',
          planName: '123',
          planPlantAreaId: 13,
          planPlantAreaName: 'asd',
          planWorkShopId: 123,
          planWorkShopName: '12ds',
          planTeamGroupId: 213,
          planTeamGroupName: '213',
          planMaterialId: 1,
          planMaterialName: '213',
          planTotalWeight: 0,
          planNumber: '213',
          planIssuedNumber: '213',
          planCreateTime: '2021-08-30',
          planUpdateTime: '2021-08-30',
          planType: 0,
          planStatus: 0,
          residueDegree: 123
        },
        {
          planId: 123,
          planMonth: '2021-04',
          planWeekNumber: '2021-09-10',
          planDate: '2021-8-31',
          planName: '123',
          planPlantAreaId: 13,
          planPlantAreaName: 'asd',
          planWorkShopId: 123,
          planWorkShopName: '12ds',
          planTeamGroupId: 213,
          planTeamGroupName: '213',
          planMaterialId: 1,
          planMaterialName: '213',
          planTotalWeight: 10,
          planNumber: '213',
          planIssuedNumber: '213',
          planCreateTime: '2021-08-30',
          planUpdateTime: '2021-08-30',
          planType: 2,
          planStatus: 0,
          residueDegree: 123
        }
      ]
    }
  },
  methods: {
    // 修改tableData
    changeTable(val) {
      this.tableData = val
    },
    deleteRow(row) {
      this.$confirm(`此操作将永久删除${row.planPlantAreaName}下的计划, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/plan/remove/${row.planId}`).then((res) => {
            this.$message({
              type: 'success',
              message: 'res.data.message'
            })
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
      //   getDataByPage('/plan/page', { pageNum: pageNum, pageSize: pageSize }).then((res) => {
      //     this.nowPageData = pageNum
      //     this.pageSize = pageSize
      //     res.data.data.records.map((item) => {
      //       item.planStatusMsg = item.planStatus ? '启用' : '停用'
      //       item.matrialStatusMsg = item.planTotalWeight == 0 ? '未发' : '已发'
      //       changeMonday(item.planWeekNumber)
      //       return item
      //     })
      //     this.tableData = res.data.data.records
      //     this.pageTotal = res.data.data.total
      //     if (res.data.data.records && res.data.data.records.length == 0 && this.nowPageData > 1) {
      //       this.nowPageData--
      //       this.getPageData()
      //     }
      //   })
      this.tableData.map((item) => {
        item.planStatusMsg = item.planStatus ? '启用' : '停用'
        item.matrialStatusMsg = item.planTotalWeight == 0 ? '未发' : '已发'
        changeMonday(item.planWeekNumber)
        return item
      })
    }
  }
}
</script>
