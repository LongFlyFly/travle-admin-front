<template>
    <div class="primary" style="overflow-x: hidden;">
      <header-view></header-view>
      <tag-view></tag-view>
      <div class="primarybox">
        <el-row :gutter="1" justify="space-around">
          <el-col :span="5">
            <el-card class="box-card">
              <el-row>
                <el-col :span="12" >
                  <el-icon :size="70" style="color: #40c9c6;"><Promotion /></el-icon>
                </el-col>
                <el-col :span="12" class="box-num">
                  <p class="box-title">景点量</p>
                  <p>{{goodNum}}</p>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="box-card">
              <el-row>
                <el-col :span="12" >
                  <el-icon :size="70" style="color: #36a3f7;"><UserFilled /></el-icon>
                </el-col>
                <el-col :span="12" class="box-num">
                  <p class="box-title">用户量</p>
                  <p>{{userNUM}}</p>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="box-card">
              <el-row>
                <el-col :span="12" >
                  <el-icon :size="70" style="color: #f4516c;"><Comment /></el-icon>
                </el-col>
                <el-col :span="12" class="box-num">
                  <p class="box-title">评论量</p>
                  <p>{{writeNum}}</p>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="box-card">
              <el-row>
                <el-col :span="12" >
                  <el-icon :size="70" style="color: #34bfa3;"><List /></el-icon>
                </el-col>
                <el-col :span="12" class="box-num">
                  <p class="box-title">订单量</p>
                  <p>{{orderNum}}</p>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>

        <el-row justify="space-around">
          <el-col :span="11">
            <el-card class="box-card">
              <vnum-view></vnum-view>
            </el-card>
          </el-col>

          <el-col :span="5">
            <el-card class="box-card">
              <div style="height: 348px;">
                <el-icon class="addicon" :size="20" @click="dialogFormVisible = true"><Plus /></el-icon>
                <el-dialog v-model="dialogFormVisible" title="添加笔记" width="30vw">
                  <el-form :model="notes">
                    <el-form-item label="笔记内容" label-width="80px">
                      <el-input v-model="notes.noteTitle" autocomplete="off" />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">返回</el-button>
                      <el-button type="primary" @click="addNote(notes.noteTitle),dialogFormVisible = false">
                        确定
                      </el-button>
                    </span>
                  </template>
                </el-dialog>

                <el-table
                  :data="tableData"
                  height="320"
                  style="width: 100%"
                  @cell-mouse-enter="hoverRow"
                  @cell-mouse-leave="leaveRow"
                >
                  <el-table-column prop="noteTitle" label="笔记" :show-overflow-tooltip="true"></el-table-column>

                  <el-table-column width="50">
                    <template v-slot="scope">
                      <el-button v-show="scope.row.noteDele == 1" type="danger" icon="Delete" size="small" plain circle @click="deleteNote(scope.row.noteID)"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>

          <el-col :span="5">
            <el-card class="box-card userbox" @click="jumpUsercenter">
              <el-row>
                <el-col :span="24">
                  <div class="boxuser">
                    <img :src="formLabel.adminImg" alt="" style="height: 80px; width: 80px; border-radius: 40px;">
                    <span style="font-size: 28px;">{{formLabel.adminName}}</span>
                    <div class="demo-progress" style="width: 12vw;">
                      <el-progress :percentage="100" style="width: 100%;">
                        <span>Vue</span>
                      </el-progress>
                      <el-progress :percentage="70"  color="#f56c6c" style="width: 100%;">
                        <span>JS</span>
                      </el-progress>
                      <el-progress :percentage="60"  color="#e6a23c" style="width: 100%;">
                        <span>CSS</span>
                      </el-progress>
                      <el-progress :percentage="50"  color="#5cb87a" style="width: 100%;">
                        <span>Html</span>
                      </el-progress>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        
      </div>
    </div>
</template>

<script>
import HeaderView from '@/components/header/HeaderView.vue';
import TagView from '@/components/header/TagView.vue';
import VnumView from '@/components/echarts/VnumView';
import axios from 'axios'
import { ref } from 'vue-demi';
import router from '@/router';

export default {
  components: { 
    HeaderView,
    TagView,
    VnumView
   },
  setup() {
    const formLabel = ref([])

    axios.get('/api/admin').then((res) => {
        formLabel.value = res.data.data[0]
    })
    // 数量获取
    const userNUM = ref('')
    axios.get('/api/user').then((res) => {
      userNUM.value = res.data.data.length
    })

    const writeNum = ref('')
    axios.get('/api/write').then((res) => {
      writeNum.value = res.data.data.length
    })

    const goodNum = ref('')
    axios.get('/api/good').then((res) => {
      goodNum.value = res.data.data.length
    })

    const orderNum = ref('')
    axios.get('/api/order').then((res) => {
      orderNum.value = res.data.data.length
    })

    const jumpUsercenter = () => {
      router.push('/usercenter')
    }

    // 笔记信息获取
    const tableData = ref([])

    axios.get('/api/note').then((res) => {
      tableData.value = res.data.data
    })

    const hoverRow = (row) => {
      row.noteDele = 1
    }
    const leaveRow = (row) => {
      row.noteDele = 0
    }
    //添加笔记
    const dialogFormVisible = ref(false)
    const notes = ref({
      noteTitle: ''
    })
    const addNote = (noteTitle) => {
      if(noteTitle != ''){
        axios.request({
          method: 'post',
          url: '/api/note/regist',
          data: {
            noteTitle: noteTitle
          }
        })
        history.go(0)
      }else{
        ElMessage({
          message: `内容为空`,
          type: 'error',
        })
      }
    }

    //删除笔记
    const deleteNote = (noteID) => {
      axios.request({
        method: 'post',
        url: '/api/note/delete',
        data: {
            noteID: noteID
        },
      })
      history.go(0)
    }
    return {
      leaveRow,
      hoverRow,
      notes,
      dialogFormVisible,
      tableData,
      userNUM,
      writeNum,
      goodNum,
      orderNum,
      formLabel,
      jumpUsercenter,
      addNote,
      deleteNote
    };
  },
};
</script>

<style lang="scss" scoped>
.primarybox{
  width: 100%;
  min-height: 500px;
}

.primary>div{
  margin-bottom: 20px;
}

.primarybox>.el-row{
  margin-bottom: 50px;
}

.el-col>p{
  margin: 0 auto;
  height: 30px;
}
.box-num{
  margin-top: 10px;
}
.box-num *{
  font-weight: 700;
}
.box-title{
  color: rgb(148, 148, 148);
  font-size: large;
  letter-spacing: 4px;
}

.userbox{
  height: 386px;
}

.boxuser,.boxtype{
  height: 348px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.demo-progress .el-progress--line {
  margin-bottom: 15px;
  margin-top: 15px;
  width: 200px;
}

.addicon{
  color: rgb(0, 145, 255);
  transition: all 0.5s linear;
  float: right;
  position: relative;
  top: 28px;
  right: 24px;
  z-index: 999;
}
.addicon:hover{
  color: rgb(0, 248, 25);
  transition: all 0.5s linear;
}
</style>