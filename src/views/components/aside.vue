<template>
  <div>
    <el-row>
      <el-col>
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#ffffff"
          text-color="black"
          router
        >
          <el-menu-item :index="item.path" v-for="(item, i) in $store.getters.routes" :key="i">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import store from '@/store/index'
export default {
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {}
  }
}
</script>

<style>
.el-menu-vertical-demo {
  min-height: 88.2vh;
  text-align: left;
  color: rgba(255, 0, 0, 0.521);
}
</style>
