<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      ref="allTable"
      @deleteRow="deleteRow"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
// getDataByPage,
import { deleteData } from '@sev/commonRequest'
export default {
  name: 'Machine',
  components: {
    AllTable
  },
  data() {
    return {
      dialogFormVisible: false,
      allTitleName: '系统人员管理',
      table: [
        {
          name: '姓名',
          prop: 'userName',
          width: '200'
        },
        {
          name: '登录账号',
          prop: 'userLoginName',
          width: '250'
        },
        {
          name: '联系方式',
          prop: 'userContact',
          width: '250'
        },
        {
          name: '权限内容',
          prop: 'privilegeCNName',
          width: '250'
        },
        {
          name: '创建日期',
          prop: 'userCreateTime',
          width: '250'
        }
      ],
      tableData: [
        {
          userId: 123,
          userName: '123',
          userCreateTime: 'wefas',
          userUpdateTime: 12,
          userContact: '123',
          userOperatorPlantAreaId: [1, 2],
          userOperatorPlantAreaName: 'asd',
          userOperatorIdCard: 123,
          userStatus: true,
          userType: 213,
          userLoginName: '1231',
          privileges: [
            {
              privilegeId: 12,
              privilegeCNName: '阿克苏'
            },
            {
              privilegeId: 12,
              privilegeCNName: '阿克苏222'
            }
          ]
        },
        {
          userId: 123,
          userName: '123',
          userCreateTime: 'wefas',
          userUpdateTime: 12,
          userContact: '123',
          userOperatorPlantAreaId: [1, 2],
          userOperatorPlantAreaName: 'asd',
          userOperatorIdCard: 123,
          userStatus: false,
          userType: 213,
          userLoginName: '1231',
          privileges: [
            {
              privilegeId: 12,
              privilegeCNName: '2'
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 分页请求
    getPageData(pageNum, pageSize) {
      this.tableData.forEach((item) => {
        item.privilegeId = item.privileges.map((item2) => {
          return item2.privilegeId
        })
        item.privilegeCNName = ''
        item.privileges.forEach((item1) => {
          console.log(item1)
          item.privilegeCNName += item1.privilegeCNName.toString() + ' '
        })
      })
      console.log(this.tableData)
      //   getDataByPage('/user/page', { pageNum: pageNum, pageSize: pageSize }).then((res) => {
      //     const data = res.data.data.records
      //   data.forEach((item) => {
      //     item.privilegeId = item.privileges.map((item2) => {
      //       return item2.privilegeId
      //     })
      //     item.privilegeCNName = ''
      //     item.privileges.forEach((item1) => {
      //       console.log(item1)
      //       item.privilegeCNName += item1.privilegeCNName.toString() + ' '
      //     })
      //   })
      //     this.tableData = res.data.data.records
      //     this.pageTotal = res.data.data.total
      //     if (res.data.data.records.length == 0 && this.nowPageData != 1) {
      //       this.nowPageData--
      //       this.getPageData(this.nowPageData, this.pageSize)
      //     }
      //   })
    },
    deleteRow(row) {
      this.$confirm(`此操作将永久删除${row.userName}当前操作, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/user/remove/${row.userId}/0`).then((res) => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
