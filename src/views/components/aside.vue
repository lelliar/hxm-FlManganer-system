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
          <el-menu-item index="/home/materialPlan">
            <i class="el-icon-menu"></i>
            <span slot="title">发料计划设置</span>
          </el-menu-item>
          <el-menu-item index="/home/operator">
            <i class="el-icon-user"></i>
            <span slot="title">自助机操作人员管理</span>
          </el-menu-item>
          <el-menu-item index="/home/plant">
            <i class="el-icon-office-building"></i>
            <span slot="title">厂区管理</span>
          </el-menu-item>
          <el-menu-item index="/home/machine">
            <i class="el-icon-cpu"></i>
            <span slot="title">自助机管理</span>
          </el-menu-item>
          <el-menu-item index="/home/warehouse">
            <i class="el-icon-house"></i>
            <span slot="title">仓库管理</span>
          </el-menu-item>
          <el-menu-item index="/home/plc">
            <i class="el-icon-document-copy"></i>
            <span slot="title">PLC管理</span>
          </el-menu-item>
          <el-menu-item index="/home/systemPerson">
            <i class="el-icon-coordinate"></i>
            <span slot="title">系统人员管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
