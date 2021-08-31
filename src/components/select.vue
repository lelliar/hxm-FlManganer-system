<template>
  <div>
    <el-select v-model="value" @change="selectData" style="width: 120px">
      <el-option
        v-for="(item, i) in optionsWare"
        :key="i"
        :label="item.label"
        :value="item.value"
        style="margin-left: 10px"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="plantValue"
      @change="selectPlantData"
      style="width: 120px; margin-left: 20px"
    >
      <el-option
        v-for="(item, i) in optionsPlant"
        :key="i"
        :label="item.label"
        :value="item.value"
        style="margin-left: 10px"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: ['optionsWare', 'optionsPlant'],
  data() {
    return {
      value: '厂区',
      plantValue: '车间',
      options: []
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.plantValue = ''
    }
  },
  methods: {
    selectData(data) {
      this.$emit('plant', { data })
    },
    selectPlantData(data) {
      this.$emit('getPlantOption', { data })
    }
  }
}
</script>

<style></style>
