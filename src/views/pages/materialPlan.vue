<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      @changeTable="changeTable"
      ref="allTable"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
import { getDataByPage } from '@sev/commonRequest'
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
          prop: 'planStatus',
          width: '100'
        },
        {
          name: '发料状态',
          prop: 'planStatus',
          width: '100'
        }
      ],
      tableData: [
        {
          planId: 123,
          planMonth: '123',
          planWeekNumber: 'wefas',
          planDate: 12,
          planName: '123',
          planPlantAreaId: 13,
          planPlantAreaName: 'asd',
          planWorkShopId: 123,
          planWorkShopName: '12ds',
          planTeamGroupId: 213,
          planTeamGroupName: '213',
          planMaterialId: '213',
          planMaterialName: '213',
          planTotalWeight: '213',
          planNumber: '213',
          planIssuedNumber: '213',
          planCreateTime: '2021-08-30',
          planUpdateTime: '2021-08-30',
          planType: '213',
          planStatus: '已发',
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
    // 分页请求
    getPageData(pageNum, pageSize) {
      getDataByPage('/plan/page', { pageNum: pageNum, pageSize: pageSize }).then((res) => {
        this.nowPageData = pageNum
        this.pageSize = pageSize
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        console.log(pageNum)
        if (res.data.data.records && res.data.data.records.length == 0 && this.nowPageData > 1) {
          this.nowPageData--
          this.getPageData()
        }
      })
    }
  }
}
</script>
