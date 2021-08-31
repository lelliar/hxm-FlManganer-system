<template>
  <div>
    <Warehouse
      @submitForm="submitForm"
      @changeRow="changeRow"
      :tableData="tableData"
      @deleteRow="deleteRow"
    >
      <template #botton="{ pageName }">
        <div class="top">
          <div class="top-title">{{ pageName }}管理</div>
          <div class="d-flex">
            <el-button
              type="primary"
              style="margin-left: 20px"
              v-if="pageName == '仓库'"
              @click="material"
              >物料管理</el-button
            >
            <el-button
              type="primary"
              style="margin-left: 20px"
              v-if="pageName == '仓库'"
              @click="machine"
              >自助机管理</el-button
            >
            <el-button type="primary" style="margin-left: 20px" @click="addWare"
              >新增{{ pageName }}</el-button
            >
          </div>
        </div>
      </template>
      <template #dio>
        <!-- eslint-disable-next-line -->
        <el-dialog :title="`${titleName}仓库`" :visible.sync="dialogFormVisible" destroy-on-close>
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="仓库编号" :label-width="formLabelWidth" prop="warehouseNumber">
              <el-input v-model="form.warehouseNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="仓库名称" :label-width="formLabelWidth" prop="warehouseName">
              <el-input v-model="form.warehouseName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="所属厂区"
              :label-width="formLabelWidth"
              prop="warehousePlantAreaId"
              :rules="{
                required: true,
                message: '所属厂区不能为空',
                trigger: 'blur'
              }"
            >
              <el-select v-model="form.warehousePlantAreaId" clearable placeholder="请选择厂区">
                <el-option
                  v-for="(item, i) in plantArea"
                  :label="item.paName"
                  :value="item.paId"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所含自助机" :label-width="formLabelWidth">
              <el-select
                v-model="form.operatingFloors"
                multiple
                clearable
                placeholder="请选择自助机"
              >
                <el-option
                  v-for="(item, i) in operatingFloorList"
                  :label="item.ofNumber"
                  :value="item.ofId"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可发物料" :label-width="formLabelWidth">
              <el-select v-model="form.materials" multiple clearable placeholder="可发物料">
                <el-option
                  v-for="(item, i) in materialList"
                  :label="item.materialName"
                  :value="item.materialId"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('form')">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          </div>
        </el-dialog>
        <el-pagination
          layout="prev, pager, next"
          :total="pageTotal"
          :page-size="pageSize"
          @current-change="pageChange"
          class="pageCurrent"
        >
        </el-pagination>
      </template>
    </Warehouse>
  </div>
</template>

<script>
// getData
import { getDataByPage, changeData, deleteData, addData } from '@sev/commonRequest'
import Warehouse from '@/views/pages/warehouse.vue'
export default {
  name: 'WarehouseSlot',
  components: {
    Warehouse
  },
  data() {
    return {
      name: '仓库',
      pageSize: 10, // 每页显示多少条,
      pageTotal: 12, // 总条数
      nowPageData: 1, // 当前第几页
      titleName: '修改',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      addForm: {}, // 修改后当前行数据
      rules: {
        warehouseNumber: [{ required: 'true', message: '请输入仓库编号', trigger: 'blur' }],
        warehouseName: [{ required: 'true', message: '请输入仓库名称', trigger: 'blur' }]
      },
      form: {},
      // 选择所含自助机
      materialList: [],
      // 厂区集合
      plantArea: [],
      // 选择所含物料
      operatingFloorList: [],
      tableData: [],
      materiaValueList: []
    }
  },
  created() {
    this.getPageData()
    this.getArea()
    this.getMachine()
    this.getMaterial()
  },
  methods: {
    // 获取所有厂区
    getArea() {
      getDataByPage('/plantArea/page', { pageNum: 1, pageSize: 999 }).then((res) => {
        this.plantArea = res.data.data.records
      })
    },
    // 获取所有自助机
    getMachine() {
      getDataByPage('/operatingFloor/page', { pageNum: 1, pageSize: 999 }).then((res) => {
        this.operatingFloorList = res.data.data.records
      })
    },
    // 获取所有物料
    getMaterial() {
      getDataByPage('/material/page', { pageNum: 1, pageSize: 999 }).then((res) => {
        this.materialList = res.data.data.records
      })
    },
    changePage(e) {
      this.nowPageData = e
    },
    // 新增仓库
    addWare() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.titleName = '新增'
      this.dialogFormVisible = true
    },
    material() {
      this.$router.push('/home/material')
    },
    // 隐藏
    dioChange() {
      this.dialogFormVisible = false
    },
    // 自助机管理
    machine() {
      this.$router.push('/home/machine')
    },
    // 删除
    deleteRow(row) {
      this.$confirm(`你将删除${row.warehouseName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(`/warehouse/remove/${row.warehouseId}`).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageData()
          })
        })
        .catch(() => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const {
            warehouseId,
            warehouseNumber,
            warehouseName,
            materials,
            warehousePlantAreaId,
            operatingFloors
          } = this.form
          const materiaValueOne = []
          const ofValueOne = []
          materials.forEach((data) => {
            materiaValueOne.push({ materialId: data })
          })
          operatingFloors.forEach((data) => {
            ofValueOne.push({ ofId: data })
          })
          if (warehouseId) {
            changeData('/warehouse/modify', {
              warehouseId,
              warehouseNumber,
              warehouseName,
              warehousePlantAreaId: warehousePlantAreaId,
              operatingFloors: ofValueOne,
              materials: materiaValueOne
            }).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.getPageData()
              this.dialogFormVisible = false
            })
          } else {
            addData('/warehouse/add', {
              warehouseNumber,
              warehouseName,
              warehousePlantAreaId: warehousePlantAreaId,
              operatingFloors: ofValueOne,
              materials: materiaValueOne
            }).then(() => {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.getPageData()
              this.dialogFormVisible = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 点击取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    // 点击修改
    changeRow(row) {
      this.dialogFormVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 获取数据
    getPageData() {
      getDataByPage('/warehouse/page', {
        pageNum: this.nowPageData,
        pageSize: this.pageSize
      }).then((res) => {
        this.pageTotal = res.data.data.total
        this.pageSize = res.data.data.size
        // 处理后端返回的数据
        for (const index in res.data.data.records) {
          const { operatingFloors } = res.data.data.records[index]
          const { materials } = res.data.data.records[index]
          for (const jav in operatingFloors) {
            res.data.data.records[index].operatingFloors[jav] = operatingFloors[jav].ofId
          }
          for (const maJav in materials) {
            res.data.data.records[index].materials[maJav] = materials[maJav].materialId
          }
        }
        this.tableData = res.data.data.records
        if (res.data.data.records.length == 0 && this.nowPageData != 1) {
          this.nowPageData--
          this.getPageData()
        }
      })
    },
    pageChange(val) {
      this.nowPageData = val
      this.getPageData()
    }
  }
}
</script>

<style>
.el-main[data-v-7eb2bc79] {
  text-align: left;
}
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
  line-height: 40px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 55px;
  line-height: 55px;
}
</style>
