import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// element-plus组件引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import zhCn from "element-plus/es/locale/lang/zh-cn"

// zhCn.el.pagination = {
//     pagesize: '条/页',
//     total: `共 {total} 条`,
//     goto: '前往第',
//     pageClassifier: '页'
// }

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
