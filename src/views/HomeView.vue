<template>
  <div class="home">
          <el-container style="height: 100%;">
            <el-aside width=auto>
              <aside-view/>
            </el-aside>

            <el-main style="padding: 0;">
              <div class="content-box" :class="{ 'content-collapse': collapse }">
                <div class="content">
                  <!-- 路由过渡动效 -->
                  <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                      <keep-alive :include="tagsList">
                        <component :is="Component" />
                      </keep-alive>
                    </transition>
                  </router-view>
                </div>
              </div>
            </el-main>
          </el-container>
  </div>
</template>

<script>
import AsideView from "@/components/aside/AsideView.vue";
import { computed } from "vue";
import { useStore } from "vuex";
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
    AsideView
  },
  setup () {
    const store = useStore();
    const tagsList = [];
    const collapse = computed(() => store.state.collapse);
    return {
      tagsList,
      collapse
    }
  }
}
</script>

<style>
.home{
  height: 100vh;
}
.el-main{
  padding: 0;
}
</style>
