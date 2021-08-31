<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      ref="allTable"
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
      tableData: [
        {
          plcdId: 123,
          plcdNumber: 123,
          plcdName: 'wefas',
          plantArea: {
            paId: 123,
            paSerialNumber: 123,
            paName: 'wefa'
          },
          material: {
            materialId: 12,
            materialNumber: 123,
            materialName: '123'
          }
        },
        {
          plcdId: 123,
          plcdNumber: 123,
          plcdName: 'wefas',
          plantArea: {
            paId: 123,
            paSerialNumber: 123,
            paName: 'wefa'
          },
          material: {
            materialId: 12,
            materialNumber: 123,
            materialName: '123'
          }
        }
      ]
    }
  },
  methods: {
    // 分页请求
    getPageData(pageNum, pageSize) {
      getDataByPage('/plcDetailed/page', { pageNum: pageNum, pageSize: pageSize }).then((res) => {
        this.nowPageData = pageNum
        this.pageSize = pageSize
        this.tableData = res.data.data.records
        this.pageTotal = res.data.data.total
        if (res.data.data.records.length == 0 && this.nowPageData != 1) {
          this.nowPageData--
          this.getPageData(this.nowPageData, this.pageSize)
        }
      })
    }
  }
}
</script>
