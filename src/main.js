// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import 'babel-polyfill'
import Vue from 'vue'
//import 'normalize.css/normalize.css' // A modern alternative to CSS resets
//import App from './App'
import store from "./store";
import axios from "./utils/axios";
//import axios from "./utils/Http";
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import VueProgressBar from "vue-progressbar";
import filters from "./filters";
import '@/styles/index.scss' // global css
import ElementUI from 'element-ui'
import i18n from './i18n/i18n';
import frame from "./frame.vue";
import ImpPanel from "./components/panel.vue";
import 'animate.css'

import {HOST} from './config/config'

// Vue.use(Element,{
//   locale
// })
//Vue.prototype.url = 'http://jujia01.ycsenior.com:5005'
Vue.prototype.url = HOST
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.axios = axios
Vue.http = axios;
Vue.use(axios);
Vue.config.productionTip = false
 //请求接口时如果没有token就直接退出登录跳转到登陆页面
Vue.prototype.logOff = function(){
  window.localStorage.removeItem('imp-sid');
  this.$http.defaults.headers.common['Authorization'] = '';
  this.$router.push({path: '/login'});
},
Vue.use(VueProgressBar, {
  color: '#eeeeee',
  failedColor: '#874b4b',
  thickness: '2px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s'
  },
  autoRevert: true,
  location: 'top',
  inverse: false
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.component(ImpPanel.name, ImpPanel);
/* eslint-disable no-new */

new Vue({
  store,
  el: '#app',
  router,
  i18n,
  render: h => h(frame), 
})

