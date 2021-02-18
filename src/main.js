import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import $http from "./api/axios"
import * as echarts from 'echarts'

const app = createApp(App);
app.config.productionTip = false;
app.config.globalProperties.$http = $http;
app.config.globalProperties.$echarts = echarts
app.use(store).use(router).use(Antd).mount('#app');