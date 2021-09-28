<template>
  <div>
    <AllTable
      :tableData="tableData"
      :table="table"
      @getPageData="getPageData"
      ref="allTable"
      :pageSzie="pageSize"
      :pageTotal="pageTotal"
      :planRules="planRules"
      @deleteRow="deleteRow"
      :allTitleName="allTitleName"
    ></AllTable>
  </div>
</template>

<script>
import AllTable from '@com/allTable'
import { deleteData, getDataByPage } from '@sev/commonRequest'
import { regNumber, isCardNo } from '@/hooks/phoneValidate'
export default {
  name: 'Machine',
  components: {
    AllTable
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!regNumber(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var validateCard = (rule, value, callback) => {
      if (!isCardNo(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      pageSize: 10,
      pageTotal: 1,
      allTitleName: '自助机操作人员管理',
      planRules: {
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        userContact: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号应为11位', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        userLoginName: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateCard, trigger: 'blur' }
        ],
        plantAreas: [{ required: true, message: '请选择可发料厂区', trigger: 'blur' }]
      },
      table: [
        {
          name: '姓名',
          prop: 'userName',
          width: '200'
        },
        {
          name: '可发料厂区',
          prop: 'plantNames',
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
          name: '身份证',
          prop: 'userLoginName',
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
      getDataByPage('/user/page', { pageNum: pageSize, pageSize: pageNum, userType: 1 }).then(
        (res) => {
          res.data.data.records = res.data.data.records.map((item) => {
            if (item.userType == 1) {
              return item
            }
          })
          res.data.data.records.forEach((item) => {
            item.plantNames = ''
            item.plantId = []
            item.userStatusMessage = item.userStatus ? '启用' : '停用'
            item.plantAreas.forEach((item2) => {
              item.plantNames += item2.paName.toString() + ' '
              item.plantId.push(item2.paId)
            })
          })
          this.pageTotal = res.data.data.total
          this.pageSize = res.data.data.size
          this.tableData = res.data.data.records
          if (res.data.data.records.length == 0 && pageSize != 1) {
            this.nowPageData--
            this.getPageData(this.pageSize, this.nowPageData)
          }
        }
      )
    },
    deleteRow(row, pageNum) {
      this.$confirm(`此操作将永久删除${row.userName}下的计划, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/user/remove/${row.userId}/1`).then((res) => {
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
