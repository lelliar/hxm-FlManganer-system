<template>
  <div class="img">
    <el-row>
      <el-col :span="14" style="height: 100vh"></el-col>
      <el-col :span="6" style="height: 100vh" class="login">
        <el-card class="login-box">
          <span class="login-text">登录</span>
          <el-form :model="loginUser" :rules="rules" ref="loginUser">
            <div class="login-input">
              <div class="login-input-username">
                <div class="login-input-username-text">账号</div>
                <el-form-item prop="userLoginName">
                  <el-input class="mt-15 inputDeep" v-model="loginUser.userLoginName"></el-input>
                </el-form-item>
              </div>
              <div class="login-input-username">
                <div class="login-input-username-text">密码</div>
                <el-form-item prop="userPassword">
                  <el-input
                    class="mt-15 inputDeep"
                    type="password"
                    v-model="loginUser.userPassword"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <el-button
            type="primary"
            class="login-box-button text-white"
            @click="submitForm('loginUser')"
            >登录</el-button
          >
        </el-card>
      </el-col>
      <el-col :span="4"></el-col>
      <div class="bottom">{{ record }}</div>
    </el-row>
  </div>
</template>

<script>
import { login } from '@/service/request'
import { buildRoute } from '@sev/premission'
import { storage } from '@/service/storage'
export default {
  data() {
    return {
      loginUser: {
        userLoginName: '',
        userPassword: '',
        userType: 0
        // userOperatorIdCard: '123456789123456789'
      },
      rules: {
        userLoginName: { required: true, message: '请输入账号', trigger: 'blur' },
        userPassword: { required: true, message: '请输入密码', trigger: 'blur' }
      },
      record: 'Copyright &#169 2011 All Right Reserved 股份有限公司 版权所有 皖ICP备05020337号'
    }
  },
  methods: {
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.loginUser).then((res) => {
            storage.set('token', res.data.data.token)
            this.$message({
              type: 'success',
              message: '登录成功'
            })
            localStorage.setItem('privilegs', JSON.stringify(res.data.data.privileges))
            localStorage.setItem('user', JSON.stringify(res.data.data.user))
            const { asyncRoutes, allRoutes } = buildRoute(res.data.data.privileges)
            _this.$store.commit('setRoutes', allRoutes)
            _this.$store.commit('setUserInfo', res.data.data.user)
            _this.$store.commit('setAsyncRoute', asyncRoutes)
            _this.$store.commit('updateAsyncRoute')
            _this.$router.push('/home')
          })
        } else {
          this.$message({
            type: 'error',
            message: '请输入账号或密码'
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.img {
  background-image: url('../assets/img/bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  min-width: 90%;
  .login {
    &-box {
      height: 60%;
      background-color: #ffffff;
      padding: 35px;
      position: relative;
      border-radius: 20px;
      top: 50%;
      min-width: 470px;
      transform: translateY(-50%);
      &-button {
        margin-top: 70px;
        width: 100%;
        height: 56px;
        border-radius: 12px;
      }
    }
    &-text {
      font-size: 40px;
      font-weight: 500;
      font-family: PingFangSC, PingFangSC-Medium;
      color: #666666;
    }
    &-input {
      margin-top: 60px;
      width: 100%;
      height: 200px;
      &-username {
        height: 50%;
        &-text {
          font-size: 14px;
          color: #666666;
          line-height: 14px;
        }
      }
    }
  }
}
.inputDeep {
  ::v-deep .el-input__inner {
    border-radius: 12px;
  }
}
.bottom {
  position: absolute;
  bottom: 30px;
  font-size: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
}
</style>
