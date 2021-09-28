<template>
  <div>
    <div class="top">
      <div class="top-name">个人信息</div>
    </div>
    <el-form
      :model="formRules"
      style="width: 50%; margin-top: 50px"
      :rules="rules"
      :label-position="labelPosition"
      label-width="120px"
      ref="formRules"
    >
      <el-form-item label="名称" style="display: flex" prop="name" class="elInput">
        <el-input
          v-model="formRules.userName"
          :disabled="true"
          style="margin-left: -120px"
        ></el-input>
      </el-form-item>
      <el-form-item label="登录账号"> {{ formRules.userLoginName }} </el-form-item>
      <el-form-item label="密码">
        <el-button type="text" @click="changePassFun">修改密码</el-button>
      </el-form-item>
      <div v-if="showPassword">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="formRules.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="repeatPassword">
          <el-input v-model="formRules.repeatPassword" type="password"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" class="submitButton" @click="submitForm('formRules')">确认</el-button>
  </div>
</template>

<script>
import { deleteData, getData } from '@/service/commonRequest'
import { storage } from '@/service/storage'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formRules.repeatPassword !== '') {
          this.$refs.formRules.validateField('repeatPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formRules.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showPassword: false,
      userName: '',
      userId: null,
      formRules: {
        userName: '',
        newPassword: '',
        repeatPassword: ''
      },
      labelPosition: 'right',
      rules: {
        userName: [{ require: true, trigger: 'blur' }],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        repeatPassword: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.userId = storage.get('user').userId
    deleteData(`/user/info/${this.userId}`).then((res) => {
      this.formRules = res.data.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getData('/user/update/password', {
            userId: this.userId,
            userPassword: this.formRules.newPassword
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '密码修改成功,请重新登录'
            })
            storage.clear()
            this.$router.push('/login')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    changePassFun() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style scoped lang="scss">
.top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  &-name {
    min-width: 7%;
    height: 5vh;
    line-height: 5vh;
    color: #333333;
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 700;
  }
}
.el-input {
  width: 150%;
}
.submitButton {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 7%;
  bottom: 10%;
}
</style>
