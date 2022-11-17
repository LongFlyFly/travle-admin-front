<template>
    <div class="feedback" style="overflow-x: hidden;">
        <header-view></header-view>
        <el-card class="box-card">
            <el-icon color="rgb(0, 221, 22)" size="120px"><CircleCheckFilled /></el-icon>
            <div style="font-size: 24px;font-weight: 800;">成功</div>
            <div>
                <a href="javascript:void(0)" @click="successJump">返回</a>
            </div>
        </el-card>
    </div>
</template>

<script>
import HeaderView from '@/components/header/HeaderView.vue'

export default{
    components:{
        HeaderView
    },
    setup() {
        const successJump = () => {
            history.go(-1)
        }
        return{
            successJump
        }
    }
}
</script>

<style>
.feedback{
    height: 100vh
}

.feedback .box-card {
  width: 80vw;
  height: 78vh;
  margin: 0 auto;
  margin-top: 14vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}

.feedback a{
    text-decoration: none;
    color: rgb(156, 156, 156)
}
</style>
