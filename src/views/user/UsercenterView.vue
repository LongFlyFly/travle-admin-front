<template>
    <div class="usercenter" style="overflow-x: hidden;">
        <header-view></header-view>
        <tag-view></tag-view>
        <el-row :gutter="1" justify="space-around">
            <el-col :span="8">
                <el-card class="box-card">
                    <img style="width: 80px; height:80px; border-radius: 40px;" :src="adminimg"/>
                    <div style="font-size: 28px;">{{adminname}}</div>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card class="box-card">
                    <el-form
                        label-position="top"
                        :model="formLabel"
                        style="width: 40vw;"
                    >
                        <el-form-item label="用户名">
                            <el-input  v-model="formLabel.adminName" />
                        </el-form-item>

                        <el-form-item label="用户密码">
                            <el-input v-model="formLabel.adminPassword" />
                        </el-form-item>

                        <el-form-item label="用户头像">
                            <el-input v-model="formLabel.adminImg" />
                            <img v-show="formLabel.adminImg != ''" :src="formLabel.adminImg" alt="" width="90" height="90">
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="updateAdmin()">
                                提交
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import HeaderView from '@/components/header/HeaderView.vue'
import TagView from '@/components/header/TagView.vue'
import axios from 'axios'
import { ref } from 'vue'
import router from '@/router'

export default{
    components:{
        HeaderView,
        TagView
    },
    setup() {
        // 修改表单
        const formLabel = ref([])
        const adminimg = ref('')
        const adminname = ref('')

        axios.get('/api/admin').then((res) => {
            formLabel.value = res.data.data[0]
            adminimg.value = res.data.data[0].adminImg
            adminname.value = res.data.data[0].adminName
        })

        const updateAdmin = () => {
            axios.request({
                method: 'post',
                url: '/api/admin/update',
                data: {
                    adminName: formLabel.value.adminName,
                    adminPassword: formLabel.value.adminPassword,
                    adminImg: formLabel.value.adminImg,
                    adminID: 1
                },
            })
            router.push('/feedback') 
      }
        return{
            adminimg,
            adminname,
            formLabel,
            updateAdmin
        }
    }
}
</script>

<style>
.usercenter{
    height: 100vh
}

.usercenter .box-card {
  width: 100%;
  height: 78vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.usercenter>*{
    margin-bottom: 20px;
}

</style>
