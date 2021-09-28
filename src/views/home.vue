<template>
  <el-container style="height: 100vh">
    <el-header style="height: 80px; background: #ffffff"><Header></Header></el-header>
    <el-container>
      <el-aside width="250px"><Aside></Aside></el-aside>
      <el-main class="main"
        ><el-card class="main-card"> <router-view /></el-card
      ></el-main>
    </el-container>
    <vue-progress-bar></vue-progress-bar>
  </el-container>
</template>

<script>
import Aside from './components/aside.vue'
import Header from './components/header.vue'
export default {
  name: 'Home',
  components: {
    Aside,
    Header
  },
  mounted() {
    this.$Progress.finish()
  },
  beforeRouteUpdate(to, form, next) {
    next()
  },
  created() {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progressOption !== undefined) {
        const meta = to.meta.progressOption
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach(() => {
      this.$Progress.finish()
    })
  }
}
</script>

<style scoped lang="scss">
body {
  background: #f2f2f2;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  margin-top: 30px;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  padding: 30px;
}
body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.main {
  &-card {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
}
</style>
<style>
body {
  background: #f2f2f2;
}
</style>
