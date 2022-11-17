<template>
    <div class="order" style="overflow-x: hidden;">
      <header-view></header-view>
      <tag-view></tag-view>
          <el-card class="box-card">
            <el-row>
              <el-col>
                <el-button type="primary" @click="visible = true" style="float: left;">添加</el-button>
                <el-button type="primary" icon="Search" style="float:right;"  @click="searchorder()">
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
                  <el-table-column prop="orderID" label="ID" width="40"/>
                  <el-table-column prop="goodID" label="景点ID"/>
                  <el-table-column prop="userID" label="用户ID"/>
                  <el-table-column prop="goodPrice" label="商品价格" />
                  <el-table-column prop="goodNum" label="商品数量" />
                  <el-table-column prop="orderTitle" label="订单备注" />
                  <el-table-column label="操作">
                    <template v-slot="scope"> 
                          <el-button  type="warning" plain 
                            @click="upsible = true;Updata(scope.row)"
                            style="margin-left: 12px;">
                            修改
                          </el-button>
                         <el-button type="danger" @click="deleteorder(scope.row.orderID)" plain>删除</el-button>
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
                <el-form-item label="连接景点ID" :label-width="formLabelWidth">
                  <el-input v-model="form.goodid" autocomplete="off" placeholder="输入连接景点ID"/>
                </el-form-item>
                <el-form-item label="连接用户ID" :label-width="formLabelWidth">
                  <el-input v-model="form.userid" autocomplete="off" placeholder="输入连接用户ID"/>
                </el-form-item>
                <el-form-item label="商品价格" :label-width="formLabelWidth">
                  <el-input v-model="form.price" autocomplete="off"  placeholder="输入商品价格"/>
                </el-form-item>
                <el-form-item label="商品数量" :label-width="formLabelWidth">
                  <el-input v-model="form.num" autocomplete="off" placeholder="输入商品数量"/>
                </el-form-item>
                <el-form-item label="订单备注" :label-width="formLabelWidth">
                  <el-input v-model="form.title" autocomplete="off" placeholder="添加订单备注"/>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">返回</el-button>
                <el-button type="primary" :loading="loading" @click="addorder()">{{
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
                <el-form-item label="连接景点ID" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodID" autocomplete="off" placeholder="输入连接景点ID"/>
                </el-form-item>
                <el-form-item label="连接用户ID" :label-width="formLabelWidth">
                  <el-input v-model="updateData.userID" autocomplete="off" placeholder="输入连接用户ID"/>
                </el-form-item>
                <el-form-item label="商品价格" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodPrice" autocomplete="off"  placeholder="输入商品价格"/>
                </el-form-item>
                <el-form-item label="商品数量" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodNum" autocomplete="off" placeholder="输入商品数量"/>
                </el-form-item>
                <el-form-item label="订单备注" :label-width="formLabelWidth">
                  <el-input v-model="updateData.orderTitle" autocomplete="off" placeholder="添加订单备注"/>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">返回</el-button>
                <el-button type="primary" @click="updateorder(updateData.orderID)">提交</el-button>
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
  name: 'orderView',
  components: { 
    HeaderView,
    TagView
  },

  setup () {
    let timer
    const table = ref(false)
    const dialog = ref(false)
    const loading = ref(false)
    const formLabelWidth = '100px'
    const form = reactive({
      userid: '',
      goodid: '',
      price: '',
      num: '',
      title: ''
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
    const updateorder = (orderID) => {
        axios.request({
          method: 'post',
          url: '/api/order/update',
          data: {
            orderID: orderID,
            goodID: updateData.value.goodID,
            userID: updateData.value.userID,
            goodPrice: updateData.value.goodPrice,
            goodNum: updateData.value.goodNum,
            orderTitle: updateData.value.orderTitle
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
    axios.get('/api/order').then((res) => {
      tableData.value = res.data.data
    })
    
    // 删除
    const deleteorder = (orderID) => {
      axios.request({
          method: 'post',
          url: '/api/order/delete',
          data: {
            orderID
          }
        })
      // 页面刷新
      router.push('/feedback')
  }

  //添加
  const addorder = ()=>{
      axios.request({
          method: 'post',
          url: '/api/order/regist',
          data: {
            goodID: form.goodid,
            userID: form.userid,
            goodPrice: form.price,
            goodNum: form.num,
            orderTitle: form.title
          }
        })
        router.push('/feedback')
  }

  //搜索
  const searchorder = ()=>{
    if(searchinput.value != ''){
      axios.request({
            method: 'post',
            url: '/api/order/search',
            data: {
              orderTitle:searchinput.value
            },
          }).then((res) => {
            // 接收的promise对象需要通过.then的方式获取
            tableData.value = res.data.data
        })
    }else {
      axios.get('/api/order').then((res) => {
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
      updateorder,
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
      addorder,
      searchorder,
      deleteorder,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style>
.order>*{
  margin-bottom: 20px;
}
.order .box-card{
  width: 96%;
  height: 82vh;
  margin: 0 auto;
}
.order .el-row{
  margin-bottom: 20px;
}
</style>
