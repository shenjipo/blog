import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import "./styles/index.scss"
import "vditor/src/assets/less/index.less"
import { createPinia } from 'pinia'
import ElementPlus from 'el-cool'
import 'el-cool/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'




const pinia = createPinia()
const app = createApp(App)
    .use(ElementPlus)
    .use(router)
    .use(pinia)

ElementPlus.CommonUtils.InitUtils(app._context)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')



