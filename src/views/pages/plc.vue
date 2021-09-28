<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      ref="allTable"
      :pageTotal="pageTotal"
      :pageSzie="pageSize"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
import { getDataByPage } from '@sev/commonRequest'
export default {
  name: 'Machine',
  components: {
    AllTable
  },
  data() {
    return {
      pageTotal: 0,
      pageSize: 10,
      dialogFormVisible: false,
      allTitleName: 'plc管理',
      table: [
        {
          name: 'PLC编号',
          prop: 'plcdNumber',
          width: '250'
        },
        {
          name: 'PLC名称',
          prop: 'plcdName',
          width: '250'
        },
        {
          name: 'IP地址',
          prop: 'plcdStatus',
          width: '250'
        },
        {
          name: '厂区',
          prop: 'plantArea.paName',
          width: '250'
        },
        {
          name: 'PLC当前状态',
          prop: 'plcdStatus',
          width: '250'
        },
        {
          name: '物料',
          prop: 'material.materialName',
          width: '250'
        }
      ],
      tableData: []
    }
  },
  methods: {
    // 分页请求
    getPageData(pageNum, pageSize) {
      getDataByPage('/plcDetailed/page', { pageNum: pageSize, pageSize: pageNum }).then((res) => {
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        if (res.data.data.records.length == 0 && pageSize != 1) {
          this.nowPageData--
          this.getPageData(this.pageSize, this.nowPageData)
        }
      })
    }
  }
}
</script>
