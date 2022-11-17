<template>
    <div class="good" style="overflow-x: hidden;">
      <header-view></header-view>
      <tag-view></tag-view>
          <el-card class="box-card">
            <el-row>
              <el-col>
                <el-button type="primary" @click="visible = true" style="float: left;">添加</el-button>
                <el-button type="primary" icon="Search" style="float:right;"  @click="searchgood()">
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
                  <el-table-column prop="goodID" label="ID" width="40"/>
                  <el-table-column prop="goodName" label="景点名"/>
                  <el-table-column prop="goodPoint" label="景点评分"/>
                  <el-table-column prop="goodAddress" label="景点地址" />
                  <el-table-column prop="goodImg" label="景点图" >
                    <template v-slot="scope">
                        <img :src="scope.row.goodImg" alt="" width="90" height="90">
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodType" label="景点类别" >
                    <template #default="scope">
                      <el-tag
                        :type="
                          scope.row.goodType == '2'
                            ? 'danger'
                            : scope.row.goodType == '0'
                            ? 'success'
                            : 'warning'
                        "
                      >
                        {{
                          scope.row.goodType == '2'
                            ? '酒店'
                            : scope.row.goodType == '0'
                            ? '景点'
                            : '美食'
                        }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="isCollect" label="是否收藏" >
                    <template #default="scope">
                      <el-tag
                        :type="scope.row.isCollect == '0'? 'warning': 'success'"
                      >
                        {{scope.row.isCollect == '0' ? '未收藏' : '已收藏'}}
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
                         <el-button type="danger" @click="deletegood(scope.row.goodID)" plain>删除</el-button>
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
                <el-form-item label="景点名" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"   placeholder="输入景点名"/>
                </el-form-item>
                <el-form-item label="景点评分" :label-width="formLabelWidth">
                  <el-input v-model="form.point" autocomplete="off" placeholder="输入景点评分"/>
                </el-form-item>
                <el-form-item label="景点地址" :label-width="formLabelWidth">
                  <el-input v-model="form.address" autocomplete="off" placeholder="输入景点地址"/>
                </el-form-item>
                <el-form-item label="景点图片" :label-width="formLabelWidth">
                  <el-input v-model="form.img" autocomplete="off"  placeholder="添加图像路径"/>
                  <img v-show="form.img != ''" :src="form.img" alt="" width="90" height="90">
                </el-form-item>
                <el-form-item label="景点类型" :label-width="formLabelWidth">
                  <el-select v-model="form.type" placeholder="请选择类型">
                    <el-option label="景点" value="0" />
                    <el-option label="美食" value="1" />
                    <el-option label="酒店" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否收藏" :label-width="formLabelWidth">
                  <el-select v-model="form.iscollect" placeholder="请选择类型">
                    <el-option label="否" value="0" />
                    <el-option label="是" value="1" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">返回</el-button>
                <el-button type="primary" :loading="loading" @click="addgood()">{{
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
                <el-form-item label="景点名" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodName" autocomplete="off"   placeholder="输入景点名"/>
                </el-form-item>
                <el-form-item label="景点评分" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodPoint" autocomplete="off" placeholder="输入景点评分"/>
                </el-form-item>
                <el-form-item label="景点地址" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodAddress" autocomplete="off" placeholder="输入景点地址"/>
                </el-form-item>
                <el-form-item label="景点图片" :label-width="formLabelWidth">
                  <el-input v-model="updateData.goodImg" autocomplete="off"  placeholder="添加图像路径"/>
                  <img v-show="updateData.goodImg != ''" :src="updateData.goodImg" alt="" width="90" height="90">
                </el-form-item>
                <el-form-item label="景点类型" :label-width="formLabelWidth">
                  <el-select v-model="updateData.goodType" placeholder="请选择类型">
                    <el-option label="景点" :value="0" />
                    <el-option label="美食" :value="1" />
                    <el-option label="酒店" :value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否收藏" :label-width="formLabelWidth">
                  <el-select v-model="updateData.isCollect" placeholder="请选择类型">
                    <el-option label="否" :value="0" />
                    <el-option label="是" :value="1" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
                <el-button @click="cancelForm">返回</el-button>
                <el-button type="primary" @click="updategood(updateData.goodID)">提交</el-button>
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
  name: 'goodView',
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
      point: '',
      address: '',
      img: '',
      type: '',
      iscollect: ''
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
    const updategood = (goodID) => {
        axios.request({
          method: 'post',
          url: '/api/good/update',
          data: {
            goodID: goodID,
            goodName: updateData.value.goodName,
            goodPoint: updateData.value.goodPoint,
            goodAddress: updateData.value.goodAddress,
            goodImg: updateData.value.goodImg,
            goodType: updateData.value.goodType,
            isCollect: updateData.value.isCollect
          },
        }).then(() => {
          router.push('/feedback')
        })
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
    axios.get('/api/good').then((res) => {
      tableData.value = res.data.data
    })
    
    // 删除
    const deletegood = (goodID) => {
      axios.request({
          method: 'post',
          url: '/api/good/delete',
          data: {
            goodID
          }
        }).then(() => {
          router.push('/feedback')
        })
  }

  //添加
  const addgood = ()=>{
      axios.request({
          method: 'post',
          url: '/api/good/regist',
          data: {
            goodName: form.name,
            goodPoint: form.point,
            goodAddress: form.address,
            goodImg: form.img,
            goodType: form.type,
            isCollect: form.iscollect
          }
        }).then(() => {
          router.push('/feedback')
        })
  }

  //搜索
  const searchgood = ()=>{
    if(searchinput.value != ''){
      axios.request({
            method: 'post',
            url: '/api/good/search',
            data: {
              goodName:searchinput.value
            },
          }).then((res) => {
            // 接收的promise对象需要通过.then的方式获取
            tableData.value = res.data.data
        })
    }else {
      axios.get('/api/good').then((res) => {
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
      updategood,
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
      addgood,
      searchgood,
      deletegood,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style>
.good>*{
  margin-bottom: 20px;
}
.good .box-card{
  width: 96%;
  height: 82vh;
  margin: 0 auto;
}
.good .el-row{
  margin-bottom: 20px;
}
</style>
