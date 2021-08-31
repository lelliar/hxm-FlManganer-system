<template>
  <div>
    <div class="all">
      <div class="img">
        <img src="@img/logo.png" alt="" />
      </div>
      <div class="user">
        <div>
          <img :src="header" alt="" class="user-img" />
        </div>
        <div class="user-text">{{ nickName }}</div>
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            <i
              class="el-icon-arrow-down el-icon--right"
              style="line-height: 64px; margin-left: 10px"
            ></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="b">修改个人信息</el-dropdown-item>
              <el-dropdown-item command="c">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@sev/storage'
export default {
  data() {
    return {
      header: require('@img/header.png'),
      nickName: '白'
    }
  },
  methods: {
    handleCommand(command) {
      if (command == 'b') {
        this.$router.push('/changePerson')
      } else {
        storage.clear()
        this.$router.push('/login')
        this.$message({
          type: 'warning',
          message: '你已退出登录'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.all {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
}
.user {
  width: 5%;
  height: 100%;
  display: flex;
  &-img {
    height: 27px;
    width: 27px;
    margin-top: 16px;
  }
  &-text {
    margin-left: 10px;
    font-size: 14px;
    line-height: 57px;
    font-family: PingFangSC, PingFangSC-Regular;
    color: #333333;
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
