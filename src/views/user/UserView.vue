<template>
    <div class="user" style="overflow-x: hidden;">
      <header-view></header-view>
      <tag-view></tag-view>
          <el-card class="box-card">
            <el-row>
              <el-col>
                <el-button type="primary" @click="visible = true" style="float: left;">添加</el-button>
                <el-button type="primary" icon="Search" style="float:right;"  @click="searchUser()">
                  搜索
                </el-button>
                <el-input
                  v-model="searchinput"
                  placeholder="Please Input"
                  prefix-icon="Search"
                  style="width: 20%; float: right;;"
                />
              </el-col>
            </el-row>

            <el-row>
              <el-table
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" 
                height="60vh" border
              >
                  <el-table-column prop="userID" label="ID" width="40"/>
                  <el-table-column prop="userName" label="用户名"/>
                  <el-table-column prop="userPassword" label="用户密码" type="password"/>
                  
                  <el-table-column prop="userImg" label="头像" >
                    <template v-slot="scope">
                        <img :src="scope.row.userImg" alt="" width="90" height="90">
                    </template>
                  </el-table-column>

                  <el-table-column prop="userPhone" label="联系电话" />
                  <el-table-column prop="userSign" label="用户类别" >
                    <template #default="scope">
                      <el-tag
                        :type="
                          scope.row.userSign == '2'
                            ? 'danger'
                            : scope.row.userSign == '0'
                            ? 'success'
                            : 'warning'
                        "
                      >
                        {{
                          scope.row.userSign == '2'
                            ? '商家用户'
                            : scope.row.userSign == '0'
                            ? '普通用户'
                            : 'VIP用户'
                        }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template v-slot="scope"> 
                          <el-button  type="warning" plain 
                            @click="upsible = true;Updata(scope.row)"
                            style="margin-left: 12px;">
                            修改
                          </el-button>
                         <el-button type="danger" @click="deleteUser(scope.row.userID)" plain>删除</el-button>
                    </template>
                  </el-table-column>
              </el-table>
            </el-row>
            
            <el-row>
              <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="tableData.length"
              >
              </el-pagination>
            </el-row>
          </el-card>
          
          <!-- 添加抽屉 -->
          <el-drawer
            v-model="visible"
            title="添加新用户"
            :before-close="handleClose"
            custom-class="demo-drawer"
          >
            <div class="demo-drawer__content">
              <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"   placeholder="输入用户名"/>
                </el-form-item>
                <el-form-item label="用户密码" :label-width="formLabelWidth">
                  <el-input v-model="form.password" autocomplete="off" type="password" placeholder="输入用户密码"/>
                </el-form-item>
                <el-form-item label="用户头像" :label-width="formLabelWidth">
                  <el-input v-model="form.img" autocomplete="off"  placeholder="添加图像路径"/>
                  <img v-show="form.img != ''" :src="form.img" alt="" width="90" height="90">
                </el-form-item>
                <el-form-item label="联系电话" :label-width="formLabelWidth">
                  <el-input v-model="form.phone" autocomplete="off" placeholder="输入联系电话"/>
                </el-form-item>
                <el-form-item label="用户类型" :label-width="formLabelWidth">
                  <el-select v-model="form.sign" placeholder="请选择类型">
                    <el-option label="普通用户" value="0" />
                    <el-option label="VIP用户" value="1" />
                    <el-option label="商家用户" value="2" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">返回</el-button>
                <el-button type="primary" :loading="loading" @click="addUser()">{{
                  loading ? 'Submitting ...' : '提交'
                }}</el-button>
              </div>
            </div>
          </el-drawer>

          <!-- 修改抽屉 -->
          <el-drawer
            v-model="upsible"
            title="修改用户数据"
            :before-close="handleClose"
            custom-class="demo-drawer"
            append-to-body="true"
          >
            <div class="demo-drawer">
              <el-form :model="updateData">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                  <el-input v-model="updateData.userName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户密码" :label-width="formLabelWidth">
                  <el-input v-model="updateData.userPassword" autocomplete="off"/>
                </el-form-item>
                <el-form-item label="用户头像" :label-width="formLabelWidth">

                  <el-input v-model="updateData.userImg" autocomplete="off" />
                  <img :src="updateData.userImg" alt="" width="90" height="90">

                </el-form-item>
                <el-form-item label="联系电话" :label-width="formLabelWidth">
                  <el-input v-model="updateData.userPhone" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户类型" :label-width="formLabelWidth">
                  <el-select v-model="updateData.userSign"  placeholder="请选择类型">
                    <el-option label="普通用户" :value="0" />
                    <el-option label="VIP用户" :value="1" />
                    <el-option label="商家用户" :value="2" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">返回</el-button>
                <el-button type="primary" @click="updateUser(updateData.userID)">提交</el-button>
              </div>
            </div>
          </el-drawer>
    </div>
</template>

<script>

import HeaderView from '@/components/header/HeaderView.vue'
import { reactive, ref } from 'vue'
import axios from 'axios'
import TagView from '@/components/header/TagView.vue'
import { ElMessageBox } from 'element-plus'
import router from '@/router'
// @ is an alias to /src

export default {
  name: 'UserView',
  components: { 
    HeaderView,
    TagView
  },

  setup () {
    let timer
    const table = ref(false)
    const dialog = ref(false)
    const loading = ref(false)
    const formLabelWidth = '80px'
    const form = reactive({
        name: '',
        password: '',
        img: '',
        phone: '',
        sign: '0',
      })
    const searchinput = ref('')
    const visible = ref(false)
    const upsible = ref(false)
    const tableData = ref([])
  
    // 分页
    const currentPage = ref(1)
    const pageSize = ref(10)
    const handleSizeChange = (val) => {
      pageSize.value = val
    }
    const handleCurrentChange = (val) => {
      currentPage.value = val
    }
    
    // 修改
    const updateUser = (userID) => {
        axios.request({
          method: 'post',
          url: '/api/user/update',
          data: {
            userName: updateData.value.userName,
            userPassword: updateData.value.userPassword,
            userImg: updateData.value.userImg,
            userPhone: updateData.value.userPhone,
            userSign: updateData.value.userSign,
            userID: userID
          },
        })
        router.push('/feedback')
      }
    // 抽屉动画
    const handleClose = (done) => {
      ElMessageBox.confirm('你想要退出吗?')
        .then(() => {
          done()
        })
        .catch(() => {
          // catch error
        })
    }

    const cancelForm = () => {
      visible.value = false
      upsible.value = false
      clearTimeout(timer)
    }


    // 数据获取
    axios.get('/api/user').then((res) => {
      tableData.value = res.data.data
    })
    
    // 删除
    const deleteUser = (userID) => {
      axios.request({
          method: 'post',
          url: '/api/user/delete',
          data: {
            userID
          }
        })
      // 页面刷新
      router.push('/feedback')
  }

  //添加
  const addUser = ()=>{
      axios.request({
          method: 'post',
          url: '/api/user/regist',
          data: {
            userName: form.name,
            userPassword: form.password,
            userImg: form.img,
            userPhone: form.phone,
            userSign: form.sign
          }
        })
        router.push('/feedback')
  }

  //搜索
  const searchUser = ()=>{
    if(searchinput.value != ''){
      axios.request({
            method: 'post',
            url: '/api/user/search',
            data: {
              userName:searchinput.value,
            },
          }).then((res) => {
            // 接收的promise对象需要通过.then的方式获取
            tableData.value = res.data.data
        })
    }else {
      axios.get('/api/user').then((res) => {
        tableData.value = res.data.data
      })
    }
  }
  
  let updateData = ref()
  const Updata = (res) => {
    updateData.value = JSON.parse(JSON.stringify(res))
    
  } 
    return {
     
      updateData,
      updateUser,
      Updata,
      formLabelWidth,
      table,
      dialog,
      loading,
      form,
      handleClose,
      cancelForm,
      searchinput,
      visible,
      upsible,
      currentPage,
      pageSize,
      tableData,
      addUser,
      searchUser,
      deleteUser,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style>
.user>*{
  margin-bottom: 20px;
}
.user .box-card{
  width: 96%;
  height: 82vh;
  margin: 0 auto;
}
.user .el-row{
  margin-bottom: 20px;
}
</style>
