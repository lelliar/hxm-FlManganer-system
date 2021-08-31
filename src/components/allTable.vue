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
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              ></el-cascader>
              <el-select
                v-model="oneOption"
                clearable
                placeholder="请选择"
                @change="oneOptionSelect"
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
          <el-table-column fixed="right" label="操作" width="200">
            <!-- v-if="allTitleName === '物料管理'" -->
            <template slot-scope="scope" style="display: flex">
              <el-button
                v-if="scope.row.planStatus == '已发'"
                @click.native.prevent="changeRow(scope.row)"
                type="text"
                >启用</el-button
              >
              <el-button
                v-if="scope.row.planStatus == '已发'"
                @click.native.prevent="changeRow(scope.row)"
                type="text"
                >停用</el-button
              >
              <el-button
                @click.native.prevent="changeRow(scope.row)"
                v-if="scope.row.planStatus == '未发'"
                type="text"
                >修改</el-button
              >
              <el-button
                v-if="scope.row.planStatus == '未发'"
                @click.native.prevent="deleteRow(scope.row)"
                type="text"
                >删除</el-button
              >
              <el-button @click.native.prevent="deleteRow(scope.row)" type="text">复制</el-button>
              <el-button @click.native.prevent="deleteRow(scope.row)" type="text"
                >发料记录</el-button
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
    <el-dialog :title="`${titleName}`" :visible.sync="dialogFormVisible" destroy-on-close>
      <el-form :model="form" :rules="rules" ref="form">
        <Title>
          <template #formList>
            <el-form-item label="物料编号" :label-width="formLabelWidth" prop="materialNumber">
              <el-input v-model="form.materialNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="物料名称：" :label-width="formLabelWidth" prop="materialName">
              <el-input v-model="form.materialName"></el-input>
            </el-form-item>
          </template>
        </Title>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Title from '@com/title.vue'
import { debounce } from '@/hooks/debounce'
import { getByIdData, getDataByPage } from '@/service/commonRequest'
export default {
  name: 'AllTable',
  components: {
    Title
  },
  props: ['tableData', 'table', 'allTitleName'],
  data() {
    return {
      form: {},
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
          value: '选项1',
          label: '厂区'
        },
        {
          value: '选项2',
          label: '车间'
        },
        {
          value: '选项3',
          label: '班组'
        }
      ],
      pageSzie: 10, // 每页显示多少条,
      pageTotal: 10, // 总条数
      nowPageData: 1, // 当前第几页
      titleName: '修改',
      formLabelWidth: '120px',
      dialogFormVisible: false, // dio显示隐藏
      rules: {
        materialNumber: [{ required: 'true', message: '请输入物料编号', trigger: 'blur' }],
        materialName: [{ required: 'true', message: '请输入物料名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.$emit('getPageData', this.pageSzie, this.nowPageData)
    this.searchAllPlantAres()
  },
  methods: {
    // 查询厂区车间班组

    searchAllPlantAres() {
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
    pageChange(val) {
      this.nowPageData = val
      this.$emit('getPageData', this.pageSzie, this.nowPageData)
    },
    // 新增
    addWare() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.titleName = '新增'
      this.dialogFormVisible = true
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.materialId
            ? this.$emit('submitFormPut', this.form)
            : this.$emit('submitAddData', this.form)
        }
      })
    },
    // 点击修改
    changeRow(row) {
      this.form = {}
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    deleteRow(row) {
      this.$emit('deleteRow', row)
    },
    // 普通选择器
    oneOptionSelect(e) {
      if (this.manyOptions == null) {
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
