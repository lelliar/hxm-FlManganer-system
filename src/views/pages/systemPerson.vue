<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      ref="allTable"
      :planRules="planRules"
      @deleteRow="deleteRow"
      :pageTotal="pageTotal"
      :pageSzie="pageSize"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
// getDataByPage,
import { deleteData, getDataByPage } from '@sev/commonRequest'
// import { regNumber } from '@/hooks/phoneValidate'
export default {
  name: 'Machine',
  components: {
    AllTable
  },
  data() {
    // var validatePhone = (rule, value, callback) => {
    //   if (!regNumber(value)) {
    //     callback(new Error('请输入正确的手机号'))
    //   }
    // }
    return {
      dialogFormVisible: false,
      allTitleName: '系统人员管理',
      pageTotal: 0,
      pageSize: 10,
      planRules: {
        userName: [{ required: 'true', message: '请输入姓名', trigger: 'blur' }],
        userLoginName: [{ required: 'true', message: '请输入登录账号', trigger: 'blur' }],
        userContact: [
          //   { validator: validatePhone, trigger: 'blur' },

          { required: 'true', message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '联系方式必须为11位' }
        ]
      },
      table: [
        {
          name: '姓名',
          prop: 'userName',
          width: '200'
        },
        {
          name: '登录账号',
          prop: 'userLoginName',
          width: '150'
        },
        {
          name: '用户状态',
          prop: 'userStatusMessage',
          width: '100'
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
      tableData: []
    }
  },
  methods: {
    // 分页请求
    getPageData(pageNum, pageSize) {
      getDataByPage('/user/page', { pageNum: pageSize, pageSize: pageNum, userType: 0 }).then(
        (res) => {
          const data = res.data.data.records
          data.forEach((item) => {
            item.userStatusMessage = item.userStatus ? '启用' : '停用'
            item.privilegeId = item.privileges.map((item2) => {
              return item2.privilegeId
            })
            item.privilegeCNName = ''
            item.privileges.forEach((item1) => {
              item.privilegeCNName += item1.privilegeCNName.toString() + ' '
            })
          })
          this.tableData = res.data.data.records
          this.pageTotal = res.data.data.total
          if (res.data.data.records.length == 0 && pageSize != 1) {
            this.nowPageData--
            this.getPageData(this.pageSize, this.nowPageData)
          }
        }
      )
    },
    deleteRow(row, pageNum) {
      this.$confirm(`此操作将永久删除${row.userName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/user/remove/${row.userId}/0`).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getPageData(this.pageSize, pageNum)
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
