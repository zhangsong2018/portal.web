import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "./utils";
import { MessageBox, Message} from "element-ui";
import {HOST} from '../config/config'

// axios 配置
axios.defaults.timeout = 15000;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://localhost:8008';
//axios.defaults.baseURL = getBaseUrl(window.location.href);

//axios.defaults.baseURL = 'http://localhost:8008';
axios.defaults.baseURL = HOST
//axios.defaults.headers.common[ 'authUid' ] = auth.getUid();
//axios.defaults.headers.common[ 'authSid' ] = auth.getSid();
//设置公用的头部token
console.log('获取本地token:',auth.bearerToken())
axios.defaults.headers.common[ 'Authorization' ] = "Bearer "+auth.bearerToken();

//POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    //debugger
    //config.data = qs.stringify(config.data);
  }

  return config;
}, (error) => {
  console.log('get错误类型：',error);
  return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use(
  response => {
    if (response.data && response.data.code) {
      if (response.data.code === '401') {
        auth.logout()
      }
    }
    return response;
  },
  error => {
    if (error && error.response) {
      //全局ajax错误信息提示
      //error": { "code": 0, "message": "角色编码重复,请更换编码"
      //MessageBox({type:"error",message:error.response.data.error.message,title:"错误提示",});
      
      Message({
        type:"error",
        message:error.response.data.error.message,
        title:"错误提示"
      })
      if(error.response.code === 401){
        console.log(123);
         //auth.logout(Vue.logOff);
         window.location.href="/"
      }
      
    }
    console.log('捕获返回的的错误信息：');
    console.log(error.response);
    // if(error.response){

    // }
    console.log(error);
    return Promise.reject(error);
  });



  //axios请求超时处理-start
  //主要思路是添加拦截器失败后进行再次请求一直到超过最大次数时放弃请求
  // https://github.com/axios/axios/issues/164#issuecomment-327837467 
  axios.defaults.retry = 4;
  axios.defaults.retryDelay = 1000;
  axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
     // Reject with the error
     return Promise.reject(err);
    }
    // Increase the retry count
    config.__retryCount += 1;
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
     setTimeout(function() {
      resolve();
     }, config.retryDelay || 1);
    });
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
     return axios(config);
    });
   });
  //axios请求超时处理-end
export function fetch (url, config = { method: 'get' }) {
  return axios.request({ ...config, url })
  // return new Promise((resolve, reject) => {
  //   axios.request({ ...config, url })
  //     .then(response => {
  //       resolve(response.data);
  //     }, err => {
  //       reject(err);
  //     })
  //     .catch((error) => {
  //       reject(error)
  //     })
  // })
}

export default axios
