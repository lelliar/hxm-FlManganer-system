<template>
  <div>
    <Title>
      <template #title>
        <div class="top">
          <div class="top-title">{{ allTitleName }}</div>
          <div class="left">
            <div class="left-input" v-if="allTitleName == '计划列表'">
              <el-cascader
                v-model="manyOptions"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                clearable
                @change="handleChange"
              ></el-cascader>
              <el-select
                v-model="oneOption"
                placeholder="请选择"
                @change="oneOptionSelect"
                clearable
                style="margin-left: 20px"
              >
                <el-option
                  v-for="item in oneOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                size="medium"
                placeholder="请输入内容"
                class="left-input-search"
                v-model="searchInput"
                @input="searchFun"
                style="margin-left: 20px"
              >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <el-upload
              v-if="allTitleName == '自助机操作人员管理'"
              class="upload-demo"
              name="ExcelData"
              ref="upload"
              :show-file-list="false"
              action="/user/operator/import"
              accept=".xls,.xlsx"
              multiple
              :on-error="errorUpload"
              :on-success="successUpload"
            >
              <el-button type="primary">EXCLE导入</el-button>
            </el-upload>
            <el-button type="primary" style="margin-left: 20px" @click="addWare">新增</el-button>
          </div>
        </div>
      </template>
    </Title>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        :prop="item.prop"
        :label="item.name"
        :width="item.width"
        v-for="(item, i) in table"
        :key="i"
      >
      </el-table-column>
      <Title>
        <template #button>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            v-if="allTitleName === '计划列表'"
          >
            <template slot-scope="scope" style="display: flex">
              <el-button
                v-if="scope.row.matrialStatusMsg == '已发'"
                @click.native.prevent="startRow(scope.row)"
                type="text"
                >启用</el-button
              >
              <el-button
                v-if="scope.row.matrialStatusMsg == '已发'"
                @click.native.prevent="stopRow(scope.row)"
                type="text"
                >停用</el-button
              >
              <el-button
                @click.native.prevent="changeRow(scope.row)"
                v-if="scope.row.matrialStatusMsg == '未发'"
                type="text"
                >修改</el-button
              >
              <el-button
                v-if="scope.row.matrialStatusMsg == '未发'"
                @click.native.prevent="deleteRow(scope.row)"
                type="text"
                >删除</el-button
              >
              <el-button @click.native.prevent="copyRow(scope.row)" type="text">复制</el-button>
              <el-button @click.native.prevent="recordRow(scope.row)" type="text"
                >发料记录</el-button
              >
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300" v-if="allTitleName != 'plc管理'">
            <template slot-scope="scope" style="display: flex">
              <el-button @click.native.prevent="startRow(scope.row)" type="text">启用</el-button>
              <el-button @click.native.prevent="stopRow(scope.row)" type="text">停用</el-button>
              <el-button @click.native.prevent="changeRow(scope.row)" type="text">修改</el-button>
              <el-button @click.native.prevent="deleteRow(scope.row)" type="text">删除</el-button>
              <el-button
                @click.native.prevent="resetPassword(scope.row)"
                type="text"
                v-if="allTitleName == '系统人员管理'"
                >重置密码</el-button
              >
            </template>
          </el-table-column>
        </template>
      </Title>
    </el-table>
    <!-- :hide-on-single-page="true" -->
    <Title>
      <template #page>
        <el-pagination
          layout="prev, pager, next"
          :total="pageTotal"
          :page-size="pageSzie"
          @current-change="pageChange"
          class="pageCurrent"
        >
        </el-pagination>
      </template>
    </Title>

    <Title>
      <template #formList>
        <!-- 计划列表的dio -->
        <el-dialog :title="`${titleName}`" :visible.sync="dialogFormVisible" @close="closeDialog">
          <el-form
            :model="form"
            :rules="planRules"
            ref="form"
            v-if="!isRecord && allTitleName == '计划列表'"
          >
            <el-form-item label="计划类型" :label-width="formLabelWidth" prop="planType">
              <el-select v-model="form.planType" placeholder="请选择">
                <el-option
                  v-for="item in oneOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="选择月份："
              :label-width="formLabelWidth"
              v-if="form.planType == 0"
              prop="planMonth"
            >
              <el-date-picker
                v-model="form.planMonth"
                type="month"
                placeholder="选择月份"
                format="yyyy 年 MM 月"
                :clearable="false"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="选择周数："
              :label-width="formLabelWidth"
              v-else-if="form.planType == 1"
              prop="planWeekNumber"
            >
              <el-date-picker
                v-model="form.planWeekNumber"
                type="week"
                placeholder="选择周数"
                format="yyyy 年 WW 周"
                :clearable="false"
                @change="changeTime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="选择日期："
              :label-width="formLabelWidth"
              v-else-if="form.planType == 2"
              prop="planDate"
            >
              <el-date-picker
                v-model="form.planDate"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划名称:" :label-width="formLabelWidth" prop="planName">
              <el-input v-model="form.planName"></el-input>
            </el-form-item>
            <el-form-item label="计划厂区" :label-width="formLabelWidth" prop="planPlantId">
              <el-cascader
                v-model="form.planPlantId"
                :options="options"
                :props="{ multiple: true, checkStrictly: true }"
                @change="handleDioChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="所发物料:" :label-width="formLabelWidth" prop="planMaterialId">
              <el-select v-model="form.planMaterialId" placeholder="请选择">
                <el-option
                  v-for="item in materialSend"
                  :key="item.materialId"
                  :label="item.materialName"
                  :value="item.materialId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发料总量" :label-width="formLabelWidth" prop="planTotalWeight">
              <el-input v-model="form.planTotalWeight"></el-input>
            </el-form-item>
            <el-form-item label="发料次数" :label-width="formLabelWidth" prop="planNumber">
              <el-input v-model="form.planNumber"></el-input>
            </el-form-item>
          </el-form>
          <!-- 系统人员管理 -->
          <el-form
            :model="form"
            :rules="planRules"
            ref="form"
            v-else-if="allTitleName == '系统人员管理'"
          >
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="登录账号" :label-width="formLabelWidth">
              <el-input v-model="form.userLoginName"></el-input>
            </el-form-item>
            <el-form-item label="默认密码" :label-width="formLabelWidth"> 111111 </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth">
              <el-input v-model="form.userContact"></el-input>
            </el-form-item>
            <el-form-item label="人员权限" :label-width="formLabelWidth">
              <el-tree
                :data="powerTree"
                show-checkbox
                default-expand-all
                node-key="id"
                v-model="form.privileges"
                @check="getPowerTree"
                ref="tree"
                highlight-current
                :props="defaultProps"
              >
              </el-tree>
            </el-form-item>
          </el-form>

          <!-- 自助机人员管理 -->
          <el-form
            :model="form"
            :rules="planRules"
            ref="form"
            v-else-if="allTitleName == '自助机操作人员管理'"
          >
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth">
              <el-input v-model="form.userContact"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input v-model="form.userOperatorIdCard"></el-input>
            </el-form-item>
            <el-form-item label="可发料厂区" :label-width="formLabelWidth">
              <el-select v-model="form.userOperatorPlantAreaId" multiple placeholder="请选择">
                <el-option
                  v-for="item in materialSend"
                  :key="item.paId"
                  :label="item.paName"
                  :value="item.paId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 插看历史记录dio -->

          <div v-else>
            <el-table :data="records" style="width: 100%">
              <el-table-column
                :prop="item.prop"
                :label="item.name"
                :width="item.width"
                v-for="(item, i) in recordsTitle"
                :key="i"
              >
              </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="recordPageTotal"
              :page-size="recordPageSize"
              @current-change="recordPageChange"
              class="pageCurrent1"
            >
            </el-pagination>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeFrom('form')">取 消</el-button>
            <el-button type="primary" @click="submit('form')">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </Title>
  </div>
</template>

<script>
import Title from '@com/title.vue'
import { debounce } from '@/hooks/debounce'
import { enable, commonEnable } from '@/hooks/enable'
import { getByIdData, getData, getDataByPage, changeData, addData } from '@/service/commonRequest'
import { getMonday } from '@/hooks/changeWeek'
import dayjs from 'dayjs'
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

export default {
  name: 'AllTable',
  components: {
    Title
  },
  props: ['tableData', 'table', 'allTitleName', 'planRules'],
  data() {
    return {
      form: {
        planType: 0,
        planMonth: 0,
        planPlantAreaId: '',
        planWorkShopId: '',
        planTeamGroupId: ''
      },
      // 权限管理树
      powerTree: [
        {
          id: 1,
          label: '页面'
        },
        {
          id: 2,
          label: '页面2'
        },
        {
          id: 3,
          label: '页面3'
        },
        {
          id: 4,
          label: '页面3'
        },
        {
          id: 5,
          label: '页面3'
        }
      ],
      // 所发物料/所有可发料的厂区
      materialSend: [
        {
          paId: 1,
          paSerialNumber: '123',
          paName: 'wefas',
          paCreateTime: '2021-08-13',
          paUpdateTime: '2021-08013'
        },
        {
          paId: 2,
          paSerialNumber: 123,
          paName: 'wefa111s',
          paCreateTime: '2021-08-13',
          paUpdateTime: '2021-08-13'
        }
      ],
      value: '',
      // 查看记录总数
      recordPageTotal: 0,
      // 查看纪律每页多少条
      recordPageSize: 10,
      // 查看记录当前多少页
      recordNowPageData: 1,
      // 是否是发料记录
      isRecord: false,
      // 搜索
      searchInput: '',
      // 级联选择器
      manyOptions: [],
      // 级联选择器列表
      options: [],

      oneOption: '', // 普通选择器
      // 普通选择器列表
      oneOptions: [
        {
          value: 2,
          label: '日计划'
        },
        {
          value: 0,
          label: '月计划'
        },
        {
          value: 1,
          label: '周计划'
        }
      ],
      // 发料记录
      records: [],
      // 发料记录头
      recordsTitle: [
        {
          name: '发料次数',
          prop: 'sirNumber',
          width: '100'
        },
        {
          name: '执行人员',
          prop: 'sirUser',
          width: '100'
        },
        {
          name: '所用自助机',
          prop: 'sirUseOperatingFloor',
          width: '150'
        },
        {
          name: '自助机所在仓库',
          prop: 'sirWarehouse',
          width: '200'
        },
        {
          name: '应发',
          prop: 'sirShouldSend',
          width: '80'
        },
        {
          name: '实发',
          prop: 'sirRealSend',
          width: '80'
        },
        {
          name: '执行时间',
          prop: 'sirExecutionTime',
          width: '200'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageSzie: 10, // 每页显示多少条,
      pageTotal: 10, // 总条数
      nowPageData: 1, // 当前第几页
      titleName: '修改',
      formLabelWidth: '120px',
      dialogFormVisible: false // dio显示隐藏
    }
  },
  created() {
    this.$emit('getPageData', this.pageSzie, this.nowPageData)
    this.searchAllPlantAres()
  },
  methods: {
    // 文件上传成功时
    successUpload() {
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    // 文件上传失败
    errorUpload() {
      this.$message({
        type: 'error',
        message: '文件上传失败'
      })
    },
    // 关闭form
    closeDialog() {
      if (this.allTitleName == '计划列表') {
        this.$refs['form'].resetFields()
      }
    },
    // 修改页多选
    handleDioChange(e) {
      console.log(e)
      this.form.planPlantId = e

      console.log(this.form)
    },
    // 获取到树的值
    getPowerTree(Node, Event) {
      this.form.privileges = Event.checkedKeys.map((item) => {
        return { privilegeId: item }
      })
    },
    handleSelectClick(data) {
      console.log(data)
    },
    // 改变周数
    changeTime(date) {
      let time = getMonday(date)
      this.form.planWeekNumber = time
    },

    // 查询厂区车间班组

    searchAllPlantAres() {
      if (this.allTitleName == '计划列表') {
        getByIdData('/plantArea/all').then((res) => {
          this.options = JSON.parse(
            JSON.stringify(res.data.data.records)
              .replace(/paId/g, 'value')
              .replace(/paName/g, 'label')
              .replace(/workShops/g, 'children')
              .replace(/wsId/g, 'value')
              .replace(/wsName/g, 'label')
              .replace(/teams/g, 'children')
              .replace(/tgId/g, 'value')
              .replace(/tgName/g, 'label')
          )
        })
      } else {
        getData('/plantArea/page', {
          pageNum: 999,
          pageSize: 1
        }).then((res) => {
          this.materialSend = res.data.data.records
        })
      }
    },
    // 查询所有物料
    searchMaterial() {
      getData('/material/page', { pageNum: 999, pageSize: 1 }).then((res) => {
        this.materialSend = res.data.data.records
      })
    },
    // 启用
    startRow(row) {
      if (this.allTitleName == '计划列表') enable(row, '启用')
      else {
        commonEnable(row.userStatus, true, '启用', '/user/startAndStop', {
          userId: row.userId,
          userStatus: row.userStatus,
          userType: row.userType
        })
      }
      this.$emit('getPageData', this.nowPageData, this.pageSzie)
    },
    // 停用
    stopRow(row) {
      if (this.allTitleName == '计划列表') enable(row, '停用')
      else {
        commonEnable(row.userStatus, false, '停用', '/user/startAndStop', {
          userId: row.userId,
          userStatus: row.userStatus,
          userType: row.userType
        })
      }
      this.$emit('getPageData', this.nowPageData, this.pageSzie)
    },
    // 防抖搜索
    searchFun(e) {
      debounce(() => {
        getDataByPage('/plan/page', {
          planName: e
        }).then((res) => {
          this.$emit('changeTable', res.data.data.records)
        })
      })
    },
    // 查看记录分页
    recordPageChange(e) {
      this.recordPageSize = e
      this.recordRow()
    },
    // 重置密码
    resetPassword(row) {
      this.$confirm(`你确定要重置${row.userName}的密码吗, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getByIdData(`/user/resetPasswords/${row.userId}`).then((res) => {
            this.$message({
              type: 'success',
              message: res.data.message
            })
            this.$emit('getPageData', this.nowPageData, this.pageSzie)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 改变页面
    pageChange(val) {
      this.nowPageData = val
      this.$emit('getPageData', this.pageSzie, this.nowPageData)
    },
    // 重置表单校验
    closeFrom(formName) {
      this.dialogFormVisible = false
      // 点击取消 数据重置
      this.$refs[formName].resetFields()
    },
    // 发料记录

    recordRow(row) {
      this.dialogFormVisible = true

      if (this.allTitleName == '计划列表') {
        this.isRecord = true
        getData(`/plan/record`, {
          sirPlanId: row.planId,
          pageNum: this.recordNowPageData,
          pageSize: this.recordPageSize
        }).then((res) => {
          this.records = res.data.data.records
          this.recordPageTotal = res.data.data.total
        })
      }
    },
    // 新增
    addWare() {
      if (this.allTitleName == '计划列表') {
        this.searchMaterial()
      }

      this.dialogFormVisible = true
      //   for (const key in this.form) {
      //     this.form[key] = ''
      //   }
      this.form = {}
      if (this.allTitleName == '系统人员管理') {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([])
        })
      }
      console.log('111')
      this.isRecord = false
      this.titleName = '新增'
    },
    // 提交
    submit(formName) {
      var changeUrl
      var addUrl
      var id
      if (this.allTitleName == '计划列表') {
        changeUrl = '/plan/modify'
        addUrl = '/plan/add'
        id = this.form.planId
        // const a = this.form.planPlantId.map((item) => {
        //   if (item.length == 1) {
        //     return { planPlantAreaId: item[0] }
        //   } else if (item.length == 2) {
        //     return { planWorkShopId: item[1] }
        //   } else {
        //     return { planTeamGroupId: item[2] }
        //   }
        // })
      } else {
        changeUrl = '/user/operator/modify'
        addUrl = '/user/add'
        id = this.form.userId
        if (this.allTitleName == '自助机操作人员管理') {
          this.form['userType'] = 1
          const { userOperatorPlantAreaId } = this.form
          this.form.userOperatorPlantAreaId = userOperatorPlantAreaId.map((item) => {
            return { userOperatorPlantAreaId: item }
          })
        } else {
          this.form['uerType'] = 0
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   this.form.materialId
          //     ? this.$emit('submitFormPut', this.form)
          //     : this.$emit('submitAddData', this.form)
          if (id) {
            changeData(changeUrl, this.form).then((res) => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$emit('getPageData', this.nowPageData, this.pageSzie)
              this.dialogFormVisible = false
            })
          } else {
            addData(addUrl, this.form).then((res) => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.$emit('getPageData', this.nowPageData, this.pageSzie)
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    // 点击修改
    changeRow(row) {
      this.dialogFormVisible = true
      if (this.allTitleName == '计划列表') {
        this.searchMaterial()
        this.isRecord = false
      }
      this.form = {}
      if (this.allTitleName == '系统人员管理') {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([])
        })
      }
      this.form = JSON.parse(JSON.stringify(row))
    },
    deleteRow(row) {
      this.$emit('deleteRow', row)
    },
    copyRow(row) {
      this.isRecord = false
      this.form = {}
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
      delete this.form.planId
    },
    // 普通选择器
    oneOptionSelect(e) {
      if (this.manyOptions.length == 0) {
        this.$message({
          type: 'error',
          message: '请先选择厂区/车间/班组'
        })
      } else {
        getDataByPage('/plan/page', {
          planPlantAreaId: this.manyOptions[0],
          planWorkShopId: this.manyOptions[1],
          planTeamGroupId: this.manyOptions[2],
          planType: e
        }).then((res) => {
          this.$emit('changeTable', res.data.data.records)
        })
      }
    },
    // 级联选择器
    handleChange(e) {
      getDataByPage('/plan/page', {
        planPlantAreaId: e[0],
        planWorkShopId: e[1],
        planTeamGroupId: e[2]
      }).then((res) => {
        this.$emit('changeTable', res.data.data.records)
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
.pageCurrent1 {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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
.left {
  float: right;
  display: flex;
  /deep/ .el-input__inner {
    border-radius: 19px;
    font-size: 14px;
    height: 36px;
    width: 130px;
  }
  &-input {
    display: flex;
    &-search {
      /deep/ .el-input__inner {
        border-radius: 19px;
        font-size: 14px;
        height: 36px;
        width: 240px;
      }
    }
  }
}
</style>
<style>
.el-main[data-v-7eb2bc79] {
  text-align: left;
}
</style>
