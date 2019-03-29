import axios from "../utils/axios";
import * as api from "../api";
import defaultValue from "./default";
import {headers,HOSTUPLOAD,ROLESANDUSERS} from '../config/config'

//export const HOSTUPLOAD = 'http://jujia01.ycsenior.com:5007';
//http://jujia01.ycsenior.com:5007/UploadFiles/

//export const ROLESANDUSERS = 'http://jujia01.ycsenior.com:5005'

//用户登录
export function login (params) {
  console.log(params)
  return new Promise((resolve, reject) => {
    axios.post(api.LOGIN, params,
      // {
      //   headers: {
      //     "content-type":"application/json",
      //   }
      // }
      headers
    
    ).then(response => {
      //console.log(response.data);
      resolve(response.data);
    }, err => {
      console.log(defaultValue.login);
      //resolve(defaultValue.login);
    })
      .catch((error) => {
        console.log(error);
        //resolve(defaultValue.login)
      })
  })
}


export  function getUses(params){
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_USER_SYSTEM_PERMISSIONS,
    ).then(response => {
      //console.log(response.data);
      resolve(response.data);
    }, err => {
      console.log(defaultValue.login);
      //resolve(defaultValue.login);
    })
      .catch((error) => {
        console.log(error);
        //resolve(defaultValue.login)
      })
  })
}


//用户消息
export function msgList (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MSG_TOP_TEN, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.msgList);
    })
      .catch((error) => {
        resolve(defaultValue.msgList)
      })
  })
}

//左侧菜单
export function menuList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_MENU_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.menuListNew);
    })
      .catch((error) => {
        resolve(defaultValue.menuListNew)
      })
  })
}
//资源列表
export function resourceList (params) {
  return new Promise((resolve, reject) => {
    axios.post(ROLESANDUSERS+"/api/Report/FileReportTypes").then(response => {
      resolve(response.data.result);
    }, err => {
      resolve(defaultValue.resource);
    })
     .catch((error) => {
        resolve(defaultValue.resource)
    })
  })
}
//角色列表
export function roleList (params) {
  return new Promise((resolve, reject) => {
    console.log(55555)
    axios.get(api.SYS_MENU_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.roleList);
    })
      .catch((error) => {
        resolve(defaultValue.roleList)
      })
  })
}


//用户列表
export function userList (params) {
  const userList = {total:defaultValue.userList.total,records:defaultValue.userList.records.reverse()}
  return new Promise((resolve, reject) => {
    axios.post(ROLESANDUSERS+"/api/Report/FileReportQuery",params,
    // {
    //   headers:{
    //   'Content-Type': "application/json"
    //   }
    // }
    headers
  ).then(response => {
      resolve(response.data);
    }, err => {
      resolve(userList);
    })
      .catch((error) => {
        resolve(userList)
      })
  })
}

//列表详情
export function userDetails (params) {
  return new Promise((resolve, reject) => {
    axios.post(ROLESANDUSERS+"/api/Report/FileReport",params).then(response => {
      resolve(response.data);
    }, err => {
      resolve(userList);
    })
      .catch((error) => {
        resolve(userList)
      })
  })
}

//系统所需数据--------------------------add
/*角色管理*/
export function rolesList (params) {
  
  return new Promise((resolve, reject) => {
    axios.post(api.SYS_ROLE_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
      .catch((error) => {
        reject(error)
      })
  })
}

/* 
报表管理
*/
export function reportManagement(params){
  return new Promise((resolve,reject)=>{
    axios.post(api.SYS_REPORT_MANAGEMENT,{params}).then(response=>{
      resolve(response.data)
    },err=>{
      reject(err)
    }).catch((error)=>{
      reject(error)
    })
  })
}

/*下载详情数据的获取*/
export function reportDetailDatas(params){
  return new Promise((resolve,reject)=>{
    axios.get(api.SYS_REPORT_DETAILS,{params}).then(response=>{
      resolve(response.data)
    },err=>{
      reject(err)
    }).catch((error)=>{
      reject(error)
    })
  })
}
/*下载报表*/
export function reportDownload(params){
  return new Promise((resolve,reject)=>{
    axios.get(HOSTUPLOAD+'/api/file/download',{params}).then(response=>{
      if(response && response.data){
        resolve(response.data)
      }else{
        reject(response)
      }
      
    },err=>{
      reject(err)
    }).catch((error)=>{
      reject(error)
    })
  })
}

/*财务报表维护*/
export function uploadReport(params){
  return new Promise((resolve,reject)=>{
    axios.post(HOSTUPLOAD+'/api/file/uploadone',{params}).then(response=>{
      if(response && response.data){
        resolve(response.data)
      }else{
        reject(response)
      }
      
    },err=>{
      reject(err)
    }).catch((error)=>{
      reject(error)
    })
  })
}


