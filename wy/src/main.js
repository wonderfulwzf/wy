import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import router from './router';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';


Vue.use(router);
Vue.use(ViewUI);

Vue.config.productionTip = false
Vue.prototype.$ajax =axios;


/**
 * axios拦截器
 */
 axios.interceptors.request.use(function (config){
  console.log("请求",config)
  return config;
},error=>{})// eslint-disable-line no-unused-vars
axios.interceptors.response.use(function (response){
  console.log("响应",response)
  return response;
},error=>{})// eslint-disable-line no-unused-vars


new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
