<template>
  <div>
    <div>
      <div class="top">
        <div class="top-title">{{ title }}列表</div>
        <div class="d-flex changeElement">
          <Select
            :optionsWare="optionsWare"
            :optionsPlant="optionsPlant"
            @plant="getWareData"
            @getPlantOption="getPlantOption"
          ></Select>
          <el-button type="primary" style="margin-left: 20px" @click="addWare"
            >新增{{ title }}</el-button
          >
        </div>
      </div>

      <WareTable
        v-if="selectType == 0 ? true : false"
        @changeDio="changeDio"
        :dialogFormVisible="dialogFormVisible"
        @getAllTableData="getAllTableData"
        @addWare="addWare"
        @changeDioTitle="changeDioTitle"
        :dioTitle="dioTitle"
      ></WareTable>
      <PlantTable
        v-if="selectType == 1 ? true : false"
        @changeDio="changeDio"
        :dialogFormVisible="dialogFormVisible"
        :wareData="wareData"
        :plantValue="plantValue"
        @getOption="getOption"
        @addWare="addWare"
        @changeDioTitle="changeDioTitle"
        :dioTitle="dioTitle"
      ></PlantTable>
      <ClassTable
        v-if="selectType == 2 ? true : false"
        @changeDio="changeDio"
        :dialogFormVisible="dialogFormVisible"
        :tgData="tgData"
        :wareData="wareData"
        @addWare="addWare"
        @changeDioTitle="changeDioTitle"
        :dioTitle="dioTitle"
      ></ClassTable>
    </div>
  </div>
</template>

<script>
import Select from '@com/select.vue'
import WareTable from '../components/wareTable'
import { getSelect, getData } from '@sev/commonRequest'
import PlantTable from '../components/plantTable.vue'
import ClassTable from '../components/classTable'

export default {
  components: {
    Select,
    PlantTable,
    ClassTable,
    WareTable
  },
  data() {
    return {
      plantData: '',
      plantValue: '',
      dioTitle: '修改',
      // 0为厂区(默认),1车间，2班组
      selectType: 0,
      wareData: '',
      tgData: '',
      title: '厂区',
      dialogFormVisible: false,
      // 厂区选择后对应的车间列表
      optionsPlant: [],
      // 厂区选择列表
      optionsWare: [
        {
          label: '所有厂区',
          value: 'all'
        }
      ],
      // 班组选择
      optionsClass: [],
      // 车间选择后对应的班组列表
      optionsClassTable: []
    }
  },
  created() {
    this.getAllTableData()
  },
  methods: {
    addWare() {
      this.dioTitle = '添加'
      this.dialogFormVisible = true
    },
    changeDioTitle(val) {
      this.dioTitle = val
    },
    changeDio(val) {
      this.dialogFormVisible = val
    },
    // 获取厂区选择列表
    getAllTableData() {
      getData('/plantArea/page', { pageNum: 1, pageSize: 999 }).then((res) => {
        this.optionsWare = [
          {
            label: '所有厂区',
            value: 'all'
          }
        ]
        for (const i in res.data.data.records) {
          const { paId, paName } = res.data.data.records[i]
          this.optionsWare.push({ value: paId, label: paName })
        }
      })
    },
    getWareData(val) {
      this.wareData = val.data
      this.getOption(val.data)
    },
    // 选择后发起请求，获取对应车间列表
    getOption(val) {
      if (val === 'all') {
        this.title = '厂区'
        this.selectType = 0
        this.optionsPlant = []
        return
      }
      getSelect(`/workShop/page`, {
        pageNum: 1,
        pageSize: 999,
        wsPlantArea: val
      }).then((res) => {
        this.optionsPlant = []
        this.optionsPlant = res.data.data.records.map((item) => {
          const { wsId, wsName } = item
          return { value: wsId, label: wsName }
        })
        this.optionsPlant = this.optionsPlant.reverse()
        this.plantValue = val
        this.title = '车间'
        this.selectType = 1
      })
    },
    // 选择车间后获取班组数据
    getPlantOption(val) {
      // 选择车间
      if (this.wareData == '') {
        this.$message({
          type: 'error',
          message: '请先选择厂区'
        })
      } else {
        this.tgData = val.data
        this.title = '班组'
        this.selectType = 2
      }
    }
  }
}
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  display: flex;
  line-height: 40px;
  justify-content: space-between;
  &-title {
    font-weight: bold;
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
  }
}

.changeElement {
  /deep/ .el-input__inner {
    border-radius: 19px;
    font-size: 14px;
    height: 36px;
    width: 130px;
  }
}
.el-button {
  border-radius: 18px;
  font-size: 14px;
}
.plantInput {
  width: 80%;
  margin: 0 auto;
}
</style>
