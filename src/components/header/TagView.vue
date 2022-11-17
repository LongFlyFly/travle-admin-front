<template>
    <div class="tag">
        <ul>
            <li
                class="tags-li"
                v-for="(item, index) in tagsList"
                :class="{ active: isActive(item.path) }"
                :key="index"
            >
                <router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link>
                <el-icon @click="closeTags(index)" style="margin-top: 5px;"><CloseBold /></el-icon>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex"
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router"

export default{
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const isActive = (path) => {
            return path === route.fullPath
        }
        // 获取vuex里面所有的tag
        const tagsList = computed(() => store.state.tagsList)
        const showTags = computed(() => tagsList.value.length > 0)
        const closeTags = (index) => {
            const delItem = tagsList.value[index];

            //让vuex删除指定的标签
            store.commit("delTagsItem", { index });

            // 如果关闭的是当前标签且标签不止一个，则激活前一个标签，如果关闭的是不是当前标签且标签不止一个，则激活后一个标签
            const item = tagsList.value[index]
                ? tagsList.value[index]
                : tagsList.value[index - 1]
            if (item) {
                // 如果删除的是当前标签，则跳往上面item判断好的目标标签的地址
                if (isActive(delItem.path)) {
                    router.push(item.path)
                }
            } else {
                // 如果tagsList只有一个标签，删除了标签就没有标签，则跳转到首页
                router.push("/primary")
            }
        };
        const setTags = (route) => {
            const isExist = tagsList.value.some((item) => {
                return item.path === route.fullPath
            });
            if (!isExist) {
                // tag超过5个就删除第一个
                if (tagsList.value.length >= 5) {
                    store.commit("delTagsItem", { index: 0 })
                }
                store.commit("setTagsItem", {
                    name: route.name,
                    path: route.fullPath,
                    title: route.meta.title,
                });
            }
        };
        //首次加载页面的时候便添加标签页
        setTags(route)
        // 监听路由变化，在当前页面即将要离开的时候触发
        onBeforeRouteUpdate((to) => {
            setTags(to)
        });
        return{
            closeTags,
            tagsList,
            showTags,
            isActive
        }
    }
}
</script>

<style>
.tag {
    margin: 0 auto;
    margin-bottom: 20px;
    margin-top: 50px;
    background-color: white;
    width: 100%;
    height: 5vh;
    border: rgb(211, 211, 211) solid 1px;
    box-shadow: rgb(211, 211, 211) 1px 1px 6px;
}
.tag a{
    text-decoration: none;
}
.tags-li {
  float: left;
  margin: -14px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 10px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}
.tags-li:not(.active):hover {
  background: #f8f8f8;
}
.tags-li.active {
  background-color: #409eff !important;
  color: #fff;
}
.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}
.tags-li.active .tags-li-title {
  color: #fff;
}
.tag .el-icon{
    transition: all 0.5s linear;
}
.tag .el-icon:hover{
    color: red;
    transition: all 0.5s linear;
}
</style>