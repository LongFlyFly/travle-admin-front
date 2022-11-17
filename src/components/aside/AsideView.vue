<template>
  <div class="aside">
        <el-menu
          class="el-menu-vertical"
          :collapse="isCollapse"
          router
          collapse-transition
          background-color = "rgb(48, 65, 86)"
          active-text-color = "#fff"
          text-color="rgb(205, 205, 205)"
          default-active="primary"
          @click="flash"
        >
          <el-menu-item index="">
            <img src="../../../public/logo.svg" style="width: 26px; height: 26px;">
            <span style="color: white;font-weight: 700;">后台管理系统</span>
          </el-menu-item>

          <template v-for="item in items">
            <template v-if="item.subs" >
              <el-sub-menu :index="item.index" :key="item.index" >
                <template #title>
                  <el-icon :size="size">
                    <component :is="item.icon" />
                  </el-icon>
                  <span>{{ item.title }}</span>
                </template>
                <template v-for="subItem in item.subs" :key="subItem.index">
                  <el-menu-item :index="subItem.index">{{ subItem.title }}</el-menu-item>
                </template>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :index="item.index" :key="item.index">
                <el-icon :size="size">
                  <component :is="item.icon" />
                </el-icon>
                <template #title>{{ item.title }}</template>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  setup () {
    const size = 12
    const items = [
      {
        icon: "homeFilled",
        index: "/primary",
        title: "系统首页"
      },
      {
        icon: "promotion",
        index: "/goods",
        title: "景点编辑",
      },
      {
        icon: "list",
        index: "/order",
        title: "订单编辑",
      },
      {
        icon: "userFilled",
        index: "/user",
        title: "用户管理"
      },
      { 
        icon: "comment",
        index: "/writes",
        title: "评论编辑",
      },
    ];
    const route = useRoute();
    const onRoutes = computed(() => {
      return route.path;
    });
    const store = useStore();
    const isCollapse = computed(() => {
      // history.go(0)
      return store.state.collapse;
    });
    const flash =()=>{
      //  history.go(0)
    }
    return{
      flash,
      size,
      items,
      onRoutes,
      isCollapse
    }
  }
}
</script>

<style>
.aside{
  height: 100%;
}
.el-menu{
  height: 100%;
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
</style>
