<template>
  <div>
    <el-table-column
      :prop="item.prop"
      :label="item.name"
      :width="item.width"
      v-for="(item, i) in table"
      :key="i"
    >
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: ['table']
}
</script>

<style></style>
