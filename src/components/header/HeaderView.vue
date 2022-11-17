<template>
    <div class="header">
        <div class="left-header">
            <!-- 折叠按钮 -->
            <div class="collapse-btn" @click="collapseChage">
                <el-icon v-if="!collapse" :size="size"><Expand /></el-icon>
                <el-icon v-else :size="size"><Fold /></el-icon>
            </div>
            <!-- 面包屑组件 -->
            <el-breadcrumb separator="/" style="margin-left: 20px;" @click="flash">
                <el-breadcrumb-item v-for="(item, index) in breadList" :key="index" :to="{ path: item.path }">
                    {{ item.meta.title }}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="right-header" v-for="(item,index) in formLabel" :key="index" >
            <el-dropdown  class="user-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link" style="display: flex; align-items:center;">
                   <img :src="item.adminImg" style="width: 40px; height:40px; border-radius: 20px; margin-right: 10px;" alt=""/>
                   <div >{{item.adminName}}</div>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="goUserCenter">
                            个人中心
                        </el-dropdown-item>
                        <el-dropdown-item divided command="loginout">
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { toRefs, computed, reactive, watch, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { slice } from "lodash";
import axios from 'axios'
    export default {
    setup() {
        // 右侧个人显示
        // const username = JSON.parse(localStorage.getItem("user"))
        const size = 20
        const store = useStore()
        const collapse = computed(() => {
            return store.state.collapse
        })
        const collapseChage = () => {
            store.commit('handleCollapse', !collapse.value)
        }
        const formLabel = ref([])

        axios.get('/api/admin').then((res) => {
            formLabel.value = res.data.data
         })

        // 个人下拉菜单
        const router = useRouter()
        const handleCommand = (command) => {
            if (command == 'loginout') {
                router.push('/')
            } else if (command == 'goUserCenter') {
                router.push('/usercenter')
                }
        }
        // 面包屑导航
        const breadList = ref([])
        const route = useRoute()
        const matched = route.matched
        const flash =()=>{
             history.go(0)
        }
        if(matched[1].name == "primary"){
            breadList.value = [{ path: "/primary" , meta: { title: "首页"}}]
            // history.go(0)
        }else{
            breadList.value = matched
        }
        return {
            flash,
            formLabel,
            breadList,
            matched,
            size,
            collapse,
            // username,
            handleCommand,
            collapseChage
        };
    }
}
</script>

<style>
.header {
  width: 100%;
  height: 50px;
  float: left;
  margin: 0 auto;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left-header{
    margin-left: 2vw;
    display: flex;
    align-items: center;
}
.right-header{
    margin-right: 2vw;
    float: right;
}
</style>