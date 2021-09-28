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
          <el-menu-item :index="item.path" v-for="(item, i) in router" :key="i">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/store/index'
export default {
  data() {
    return {
      router: null
    }
  },
  created() {
    this.router = store.state.routes
      .filter(
        (route) =>
          route.name !== '404' &&
          route.name !== 'login' &&
          route.name !== 'Home' &&
          route.meta &&
          route.meta.title
      )
      .map((route) => ({
        title: route.meta.title,
        path: route.path,
        icon: route.meta.icon
      }))
  },
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
