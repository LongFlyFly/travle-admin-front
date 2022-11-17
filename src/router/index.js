import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/login/LoginView.vue'

import GoodsView from '../views/forms/GoodsView.vue'
import WritesView from '../views/forms/WritesView.vue'
import OrderView from '../views/forms/OrderView.vue'
import UserView from '../views/user/UserView.vue'
import UsercenterView from '../views/user/UsercenterView.vue'
import PrimaryView from '../views/primary/PrimaryView.vue'

import FeedbackView from '../components/FeedbackView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
 
  {
    path: '/home',
    name: 'home',
    redirect: "/primary",
    meta: {
      title: "首页"
    },
    component: HomeView,
    children: [
      {
        path: "/primary",
        name: "primary",
        meta: {
          title: "首页"
        },
        component: PrimaryView
      },
      {
        path: '/goods',
        name: 'goods',
        meta: {
          title: "景点编辑编辑"
        },
        component: GoodsView
      },
      {
        path: '/writes',
        name: 'writes',
        meta: {
          title: "评论编辑"
        },
        component: WritesView
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: "用户管理"
        },
        component: UserView
      },
      {
        path: '/order',
        name: 'order',
        meta: {
          title: "订单管理"
        },
        component: OrderView
      },
      {
        path: '/usercenter',
        name: 'usercenter',
        meta: {
          title: "用户中心"
        },
        component: UsercenterView
      },
      {
        path: '/feedback',
        name: 'feedback',
        meta: {
          title: "成功反馈"
        },
        component: FeedbackView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
