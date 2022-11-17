<template>
<div class="login-wrap">
    <img src="../../assets/loginback.jpg" style="width: 100%; height: 100%;"  alt="">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form
        class="ms-content"
        :model="param"
        :rules="rules"
        ref="loginForm"
        label-width="0px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="param.username"
            placeholder="username"
            prefix-icon="User"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm"
            prefix-icon="Unlock"
          >
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, unref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../../utils/request'
import axios from 'axios'
export default {
  setup() {
    const param = reactive({
      username: '',
      password: '',
    })
    const rules = {
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码位数只能在6~10之间', trigger: 'blur' },
      ],
    }
    const loginForm = ref(null)
    const router = useRouter()

    const submitForm = async () => {
      const adminData = ref([])
      await axios.get('/api/admin').then((res) => {
        adminData.value = res.data.data[0]
      })
      await loginForm.value.validate((valid) => {
        if (valid) {
          request
            .request({
              url: '/api/admin/login', 
              method: 'post',
              data: {
                adminName: param.username,
                adminPassword: param.password,
                adminDataname: adminData.value.adminName,
                adminDatapass: adminData.value.adminPassword
              },
            })
            .then((res) => {
              if (res.data.code == '200' && res.data.msg == 'success') {
                ElMessage({
                  message: `恭喜,${param.username}登录成功`,
                  type: 'success',
                })
                localStorage.setItem(
                  'userInfo',
                  JSON.stringify({
                    user: res.data.data.user,
                    accessToken: res.data.data.accessToken,
                  })
                )
                localStorage.setItem('user', JSON.stringify(param.username))
                router.push('/home')
              }else{
                ElMessage({
                  message: `登录失败,请重试`,
                  type: 'error',
                })
              }
            })
            .catch((e) => {
              console.log(e)
              // ElMessage({
            })
        } else {
          ElMessage({
            message: `登录失败,请重试`,
            type: 'error',
          })
        }
      })
    }
    return {
      loginForm,
      submitForm,
      param,
      rules,
    }
  },
}
</script>
<style lang="scss" scoped>

.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
  // margin-top: 300px;
}
.ms-title {
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 20px;
  color: #fff;
}
.ms-login {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: rgba(229, 229, 229, 0);
  box-shadow: black 1px 1px 10px;
  overflow: hidden;
}
.ms-content {
  padding: 50px 50px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 42px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

.el-form{
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
