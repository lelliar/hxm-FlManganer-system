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
                :props="{ checkStrictly: true }"
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
            <el-button
              type="primary"
              style="margin-right: 20px"
              @click="exportModel"
              v-if="allTitleName == '自助机操作人员管理'"
              >EXCLE模板导出</el-button
            >
            <el-upload
              v-if="allTitleName == '自助机操作人员管理'"
              class="upload-demo"
              name="excelData"
              ref="upload"
              :headers="upLoadHeaders"
              :show-file-list="false"
              action="http://192.168.0.99:8080/user/operator/import"
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
    <el-table
      :data="tableData"
      max-height="600"
      style="width: 100%"
      :row-style="{ height: '30px' }"
      :cell-style="{ padding: '0' }"
    >
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
          <el-table-column
            fixed="right"
            label="操作"
            width="300"
            v-if="allTitleName != 'plc管理' && allTitleName != '计划列表'"
          >
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
          :current-page="nowPageData"
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
            <el-form-item
              label="计划类型"
              :label-width="formLabelWidth"
              v-if="titleName != '修改'"
              prop="planType"
            >
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
              v-if="form.planType == 0 && titleName != '修改'"
              prop="planMonth"
            >
              <el-date-picker
                v-model="form.planMonth"
                type="month"
                placeholder="选择月份"
                @change="handleMonthChange"
                format="yyyy 年 MM 月"
                :clearable="false"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="选择周数："
              :label-width="formLabelWidth"
              v-else-if="form.planType == 1 && titleName != '修改'"
              prop="planWeekNumber"
            >
              <el-select v-model="form.planWeekNumber" placeholder="请选择">
                <el-option v-for="item in weeks" :key="item" :label="item" :value="item">
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="选择日期："
              :label-width="formLabelWidth"
              v-else-if="form.planType == 2 && titleName != '修改'"
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
            <el-form-item
              label="所发物料:"
              :label-width="formLabelWidth"
              prop="planMaterialId"
              v-if="titleName != '修改'"
            >
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
            <el-form-item label="计划名称:" :label-width="formLabelWidth" prop="planName">
              <el-input v-model="form.planName"></el-input>
            </el-form-item>
            <el-form-item
              label="计划厂区"
              :label-width="formLabelWidth"
              prop="planPlantId"
              v-if="titleName != '修改'"
            >
              <el-cascader
                v-model="form.planPlantId"
                :options="options"
                ref="cascader"
                :props="{ multiple: true, checkStrictly: true }"
                @focus="handleDioChange"
                @change="handleDio"
              ></el-cascader>
            </el-form-item>

            <el-form-item label="发料总量" :label-width="formLabelWidth" prop="planTotalWeight">
              <el-input
                oninput="value=value.replace(/[^\d]/g,'')"
                v-model="form.planTotalWeight"
              ></el-input>
            </el-form-item>
            <el-form-item label="发料次数" :label-width="formLabelWidth" prop="planNumber">
              <el-input
                v-model="form.planNumber"
                oninput="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- 系统人员管理 -->
          <el-form
            :model="form"
            :rules="planRules"
            ref="form"
            v-else-if="allTitleName == '系统人员管理'"
          >
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="登录账号" :label-width="formLabelWidth" prop="userLoginName">
              <el-input v-model="form.userLoginName"></el-input>
            </el-form-item>
            <el-form-item label="默认密码" :label-width="formLabelWidth"> 000000 </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth" prop="userContact">
              <el-input
                v-model="form.userContact"
                oninput="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="人员权限" :label-width="formLabelWidth">
              <el-tree
                :data="powerTree"
                show-checkbox
                :default-checked-keys="powerSelectTree"
                node-key="value"
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
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="userName">
              <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth" prop="userContact">
              <el-input
                v-model="form.userContact"
                oninput="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="身份证号" :label-width="formLabelWidth" prop="userLoginName">
              <el-input v-model="form.userLoginName"></el-input>
            </el-form-item>
            <el-form-item label="可发料厂区" :label-width="formLabelWidth">
              <el-select v-model="form.plantId" multiple placeholder="请选择">
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
import axios from 'axios'
import {
  getByIdData,
  getData,
  getDataByPage,
  changeData,
  addData,
  deleteData
} from '@/service/commonRequest'
import { handleCofirm } from '@/hooks/messageBox'
import { Message } from 'element-ui'
import { getMonday } from '@/hooks/changeWeek'
import { storage } from '@sev/storage'
import dayjs from 'dayjs'
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

export default {
  name: 'AllTable',
  components: {
    Title
  },
  props: ['tableData', 'table', 'allTitleName', 'planRules', 'pageTotal', 'pageSzie', 'pageBool'],
  data() {
    return {
      // 当前周
      nowWeek: '',
      form: {
        planType: 0,
        planMonth: 0,
        planTotalWeight: 0,
        planPlantAreaId: '',
        planWorkShopId: '',
        planTeamGroupId: ''
      },
      // 权限管理树
      powerTree: [],
      // 权限管理选择
      powerSelectTree: [],
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
          value: 1,
          label: '周计划'
        },
        {
          value: 0,
          label: '月计划'
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
      // 周的集合
      weeks: [],

      upLoadHeaders: {
        token: storage.get('token').data
      },
      nowPageData: 1, // 当前第几页
      titleName: '修改',
      formLabelWidth: '120px',
      dialogFormVisible: false // dio显示隐藏
    }
  },
  created() {
    this.$emit('getPageData', this.pageSzie, this.nowPageData)
    this.searchAllPlantAres()
    if (this.allTitleName == '系统人员管理') {
      this.searchPrive()
    }
    if (this.allTitleName == '计划列表') {
      this.handleDioCreate()
      deleteData('/week/get').then((res) => {
        this.weeks = res.data.data
      })
    }
  },
  methods: {
    // 文件上传成功时
    successUpload(e) {
      if (e.code == 999) {
        this.$message({
          type: 'error',
          message: e.msg
        })
      } else {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.$emit('getPageData', this.pageSzie, this.nowPageData)
      }
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
        this.handleDioCreate()
      }
      if (this.allTitleName == '系统人员管理') {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([])
        })
      }
    },
    handleDio(e) {
      this.form.planPlantId = e
    },
    // 多选过滤;
    handleDioChangeFilter(data) {
      this.options = JSON.parse(
        JSON.stringify(data)
          .replace(/paIsPlan/g, 'disabled')
          .replace(/wsIsPlan/g, 'disabled')
          .replace(/teamIsPlan/g, 'disabled')
          .replace(/paId/g, 'value')
          .replace(/paName/g, 'label')
          .replace(/workShops/g, 'children')
          .replace(/wsId/g, 'value')
          .replace(/wsName/g, 'label')
          .replace(/teams/g, 'children')
          .replace(/teamId/g, 'value')
          .replace(/teamName/g, 'label')
      )
    },
    // 进入页面时的多选
    handleDioCreate() {
      getByIdData('/plantArea/all').then((res) => {
        this.handleDioChangeFilter(res.data.data)
      })
    },
    // 修改页多选
    handleDioChange() {
      this.options = []
      if (
        this.form.planMaterialId &&
        (this.form.planWeekNumber || this.form.planDate || this.form.planMonth)
      ) {
        if (this.form.planType == 0) {
          getData('/plan/getPlantAreaIsPlan', {
            planType: 0,
            planMaterialId: this.form.planMaterialId,
            planMonth: this.form.planMonth
          }).then((res) => {
            this.handleDioChangeFilter(res.data.data)
          })
        }
        if (this.form.planType == 1) {
          getData('/plan/getPlantAreaIsPlan', {
            planType: 1,
            planWeekNumber: this.form.planWeekNumber,
            planMaterialId: this.form.planMaterialId
          }).then((res) => {
            this.handleDioChangeFilter(res.data.data)
          })
        }
        if (this.form.planType == 2) {
          getData('/plan/getPlantAreaIsPlan', {
            planType: 2,
            planDate: this.form.planDate,
            planMaterialId: this.form.planMaterialId
          }).then((res) => {
            this.handleDioChangeFilter(res.data.data)
          })
        }
      } else {
        this.$message({
          type: 'error',
          message: '请先选择所发物料/计划类型'
        })
      }
    },
    // 获取到树的值
    getPowerTree(Node, Event) {
      this.form.privileges = Event.checkedNodes.map((item) => {
        return { privilegeId: item.value }
      })
    },
    handleSelectClick(data) {},
    // 改变周数
    changeTime(date) {
      let time = getMonday(date)
      this.form.planWeekNumber = time
    },

    // 查询厂区车间班组

    searchAllPlantAres() {
      getData('/plantArea/page', {
        pageNum: 1,
        pageSize: 999
      }).then((res) => {
        this.materialSend = res.data.data.records
      })
    },
    // 查询所有物料
    searchMaterial() {
      getData('/material/page', { pageNum: 1, pageSize: 999 }).then((res) => {
        this.materialSend = res.data.data.records
      })
    },
    // 启用
    startRow(row) {
      if (this.allTitleName == '计划列表') {
        if (row.planStatusMsg == '启用') {
          Message({
            type: 'warning',
            message: `当前计划已经启用了嗷!`
          })
        } else {
          handleCofirm(`你确认要启用${row.planWorkShopName}计划吗`).then((res) => {
            getData('/plan/startAndStop', { planId: row.planId, planStatus: 1 }).then((res) => {
              Message({
                type: 'success',
                message: `启用成功`
              })
              this.$emit('getPageData', this.pageSzie, this.nowPageData)
            })
          })
        }
      } else {
        if (row.userStatus == true) {
          Message({
            type: 'warning',
            message: `当前人员已经启用了嗷！`
          })
        } else {
          handleCofirm(`你确认要启用当前人员吗`).then((res) => {
            getData('/user/startAndStop', {
              userId: row.userId,
              userStatus: !row.userStatus
            }).then((res) => {
              Message({
                type: 'success',
                message: `启用成功`
              })
              this.$emit('getPageData', this.pageSzie, this.nowPageData)
            })
          })
        }
      }
    },
    // 选择月份后
    handleMonthChange(e) {
      this.form.planMonth = e
    },
    // 停用
    stopRow(row) {
      if (this.allTitleName == '计划列表') {
        if (row.planStatusMsg == '停用') {
          Message({
            type: 'warning',
            message: `当前计划已经停用了嗷!`
          })
        } else {
          handleCofirm(`你确认要停用${row.planWorkShopName}计划吗`).then((res) => {
            getData('/plan/startAndStop', { planId: row.planId, planStatus: 0 }).then((res) => {
              Message({
                type: 'success',
                message: `停用成功`
              })
              this.$emit('getPageData', this.pageSzie, this.nowPageData)
            })
          })
        }
      } else {
        if (row.userStatus == false) {
          Message({
            type: 'warning',
            message: `当前人员已经停用了嗷！`
          })
        } else {
          handleCofirm(`你确认要停用当前人员吗`).then((res) => {
            getData('/user/startAndStop', {
              userId: row.userId,
              userStatus: !row.userStatus
            }).then((res) => {
              Message({
                type: 'success',
                message: `停用成功`
              })
              this.$emit('getPageData', this.pageSzie, this.nowPageData)
            })
          })
        }
      }
    },
    // 防抖搜索
    searchFun(e) {
      if (this.pageBool) {
        this.nowPageData = 1
      }
      debounce(() => {
        getDataByPage('/plan/page', {
          planName: e,
          pageNum: this.nowPageData,
          pageSize: 10
        }).then((res) => {
          this.$emit('changeTable', res.data.data)
          this.$emit('changepageBool', false)
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
              message: '重置密码成功'
            })
            this.$emit('getPageData', this.pageSzie, this.nowPageData)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查询所有权限
    searchPrive() {
      getData('/privilege/page', { pageNum: 999, pageSize: 1 }).then((res) => {
        this.powerTree = JSON.parse(
          JSON.stringify(res.data.data.records)
            .replace(/privilegeId/g, 'value')
            .replace(/privilegeCNName/g, 'label')
        )
        this.powerTree = this.powerTree.filter((item) => {
          return item.value != 1 && item.value != 2
        })
      })
    },
    // 改变页面
    pageChange(val) {
      this.nowPageData = val
      if (this.planType) {
        this.$emit('changepageBool', false)
        this.oneOptionSelect(this.planType)
      } else if (this.manyOptions.length != 0) {
        this.$emit('changepageBool', false)
        this.handleChange(this.manyOptions)
      } else if (this.searchInput) {
        this.$emit('changepageBool', false)
        this.searchFun(this.searchInput)
      } else {
        this.$emit('changepageBool', false)
        this.$emit('getPageData', this.pageSzie, this.nowPageData)
      }
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
        getData(`/storeIssueRecord/page`, {
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
      this.form = {}

      this.isRecord = false
      this.titleName = '新增'
    },
    // 导出EXCEL模板
    exportModel() {
      axios({
        method: 'get',
        url: '/自助机操作员导入模板.xlsx',
        responseType: 'blob'
      }).then((res) => {
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        window.location.href = objectUrl
      })
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var changeUrl
          var addUrl
          var id
          if (this.allTitleName == '计划列表' && this.titleName != '修改') {
            addUrl = '/plan/add'
            this.form.planTotalWeight = Number(this.form.planTotalWeight)
            this.form.planNumber = Number(this.form.planNumber)
            this.form.plantAreas = []
            this.form.workShops = []
            this.form.teams = []
            this.form.planPlantId.forEach((item) => {
              if (item.length == 1) {
                this.form.plantAreas.push({ paId: item[0] })
              }
              if (item.length == 2) {
                this.form.workShops.push({ wsId: item[1], wsPlantArea: item[0] })
              }
              if (item.length == 3) {
                this.form.teams.push({
                  teamId: item[2],
                  teamPlantAreaId: item[0],
                  teamWorkShopId: item[1]
                })
              }
            })
          } else if (this.allTitleName == '计划列表' && this.titleName == '修改') {
            changeUrl = '/plan/modify'
            id = this.form.planId
            this.form = {
              planId: id,
              planName: this.form.planName,
              planTotalWeight: Number(this.form.planTotalWeight),
              planNumber: Number(this.form.planNumber)
            }
          } else {
            changeUrl = '/user/modify'
            addUrl = '/user/add'
            id = this.form.userId
            if (this.allTitleName == '自助机操作人员管理') {
              this.form['userType'] = 1
              const { plantId } = this.form
              delete this.form.plantAreass
              this.form.plantAreas = plantId.map((item) => {
                return { paId: item }
              })
            } else {
              this.form['userType'] = 0
            }
          }
          //   this.form.materialId
          //     ? this.$emit('submitFormPut', this.form)
          //     : this.$emit('submitAddData', this.form)
          if (id) {
            changeData(changeUrl, this.form).then((res) => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$emit('getPageData', this.pageSzie, this.nowPageData)
              this.dialogFormVisible = false
            })
          } else {
            delete this.form.planPlantId
            addData(addUrl, this.form).then((res) => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.$emit('getPageData', this.pageSzie, this.nowPageData)
              this.dialogFormVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 点击修改
    changeRow(row) {
      this.dialogFormVisible = true
      this.titleName = '修改'
      if (this.allTitleName == '计划列表') {
        this.searchMaterial()
        this.isRecord = false
      }
      this.form = {}
      if (this.allTitleName == '系统人员管理') {
        if (row.privileges.length != 0) {
          this.powerSelectTree = row.privileges.map((item) => {
            return item.privilegeId
          })
        } else {
          this.powerSelectTree = []
        }
      }
      // 将权限规则改为对应数组

      this.form = JSON.parse(JSON.stringify(row))
    },
    // 清空el-tree
    rest() {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
    },
    deleteRow(row) {
      const _this = this
      _this.$emit('deleteRow', row, this.nowPageData)
    },
    copyRow(row) {
      this.isRecord = false
      this.form = {}
      this.titleName = '新增'
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
      delete this.form.planId
    },
    // 普通选择器
    oneOptionSelect(e) {
      if (this.pageBool) {
        this.nowPageData = 1
      }
      let id
      this.planType = e
      switch (this.manyOptions.length) {
        case 0:
          id = { planType: e, pageSize: 10, pageNum: this.nowPageData, planName: this.searchInput }
          break
        case 1:
          id = {
            planPlantAreaId: this.manyOptions[0],
            pageSize: 10,
            pageNum: this.nowPageData,
            planType: e,
            planName: this.searchInput
          }
          break
        case 2:
          id = {
            planWorkShopId: this.manyOptions[1],
            pageSize: 10,
            pageNum: this.nowPageData,
            planType: e,
            planName: this.searchInput
          }
          break
        case 3:
          id = {
            planTeamGroupId: this.manyOptions[2],
            pageSize: 10,
            pageNum: this.nowPageData,
            planType: e,
            planName: this.searchInput
          }
          break
      }
      getDataByPage('/plan/page', id).then((res) => {
        this.$emit('changeTable', res.data.data)
         this.$emit('changepageBool', false)
      })
    },
    // 级联选择器
    handleChange(e) {
      if (this.manyOptions.length != 0) {
        if (this.pageBool) {
          this.nowPageData = 1
        }
        // eslint-disable-next-line prettier/prettier
        let id
        switch (e.length) {
          case 1:
            id = {
              planPlantAreaId: e[0],
              pageSize: 10,
              pageNum: this.nowPageData,
              planType: this.planType,
              planName: this.searchInput
            }
            break
          case 2:
            id = {
              planWorkShopId: e[1],
              pageSize: 10,
              pageNum: this.nowPageData,
              planType: this.planType,
              planName: this.searchInput
            }
            break
          case 3:
            id = {
              planTeamGroupId: e[2],
              pageSize: 10,
              pageNum: this.nowPageData,
              planType: this.planType,
              planName: this.searchInput
            }
            break
        }
        getDataByPage('/plan/page', id).then((res) => {
          this.$emit('changeTable', res.data.data)
           this.$emit('changepageBool', false)
        })
      } else if (this.oneOption) {
        this.oneOptionSelect(this.oneOption)
      } else {
        this.$emit('getPageData', this.pageSzie, 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pageCurrent {
  position: absolute;
  bottom: 40px;
  left: 50%;
}
.pageCurrent1 {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-150%);
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
