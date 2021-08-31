<template>
  <div>
    <slot name="botton" :pageName="pageName"></slot>
    <el-table :data="tableData" style="width: 100%">
      <Table :table="table"></Table>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope" style="display: flex">
          <el-button @click.native.prevent="changeEmit(scope.row)" type="text">修改</el-button>
          <el-button @click.native.prevent="changeDelete(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <slot name="dio"></slot>
  </div>
</template>
<script>
import Table from '@com/table.vue'
export default {
  name: 'Warehouse',
  props: ['tableData'],
  components: {
    Table
  },
  data() {
    return {
      pageName: '仓库',
      materialList: [], // 物料集合
      warehouseList: [], // 厂区集合
      ofList: [], // 自助机集合
      page: 1,
      table: [
        {
          name: '所含自助机',
          prop: 'operatingFloorNames',
          width: '300'
        },
        {
          name: '仓库编号',
          prop: 'warehouseNumber',
          width: '200'
        },
        {
          name: '仓库名称',
          prop: 'warehouseName',
          width: '300'
        },
        {
          name: '仓库所属厂区',
          prop: 'warehousePlantAreaName',
          width: '200'
        },

        {
          name: '可发物料',
          prop: 'materialNames',
          width: '300'
        }
      ]
    }
  },
  methods: {
    changePage(val) {
      this.$emit('changePage', val)
    },
    changeEmit(row) {
      this.$emit('changeRow', row)
    },
    changeDelete(row) {
      this.$emit('deleteRow', row)
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
  margin-bottom: 30px;
  justify-content: space-between;
  &-title {
    font-weight: bold;
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
  }
}
.pageCurrent {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(50%);
}
</style>
<style>
.el-main[data-v-7eb2bc79] {
  text-align: left;
}
</style>
