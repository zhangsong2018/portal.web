import Vue from "vue";
import Vuex from "vuex";
import types from "./mutation-types";
import defaultValue from "../services/default";
import * as api from "../api/index";
import { getCurrentMenu, getSessionKey } from '../utils/utils'
import {headers} from '../config/config'

Vue.use(Vuex)
const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production', 直接修改state 抛出异常

  getters: {
    loading: state => state.loading,
    menuList: state => state.menuList,
    sidebar: state => state.sidebar,
    userInfo:state => state.userInfo,
    device:state => state.device,
    currentMenus:state => state.currentMenus,
  },
  state: {
    loading: false,
    menuList: {},
    sidebar: {
      collapsed: getSessionKey('state.sidebar.collapsed','true')==='true',
      show: getSessionKey('state.sidebar.show','true')==='true',
    },
    device: {
      isMobile: false
    },
    userInfo:{
      name:'佚名',
      tempExpires:0,
      tokenType:""
    },
    currentMenus:[],
  },
  mutations: {
    //只能同步的函数
    [types.TOGGLE_DEVICE] (state, isMobile) {
      state.device.isMobile = isMobile
    },
    [types.TOGGLE_LOADING] (state) {
      state.loading = !state.loading
    },
    [types.LOAD_MENU] (state, menu) {
      //console.log('111',menu)
      state.menuList = [];
      state.menuList = menu;
    },
    [types.LOAD_CURRENT_MENU] (state, menu) {
      state.currentMenus = menu;
      console.log("输出menu:")
      console.log(menu);
      //window.sessionStorage.setItem("state.sidebar.collapsed",collapsed)
    },
    [types.SET_USER_INFO] (state, info) {
      //console.log('获取用户',info)
      //debugger
      state.userInfo = info||state.userInfo;
    },
    

    [types.TOGGLE_SIDEBAR] (state, collapsed) {
      if (collapsed == null) collapsed = !state.sidebar.collapsed;
      state.sidebar.collapsed = collapsed;
      window.sessionStorage.setItem("state.sidebar.collapsed",collapsed)
    },
    [types.TOGGLE_SIDEBAR_SHOW] (state,show) {
      if (show == null) state.sidebar.show = !state.sidebar.show;
      else{
        state.sidebar.show = show;
      }
      window.sessionStorage.setItem("state.sidebar.show",state.sidebar.show)
    },
    [types.SET_BEARER](state,berear){
      state.berear = berear
    }
  }, actions: {
    //异步的函数
    toggleLoading: ({commit}) => commit(types.TOGGLE_LOADING),
    loadMenuList: ({commit}) => {

      let auto = window.localStorage["imp-sid"];
      Vue.axios.defaults.headers.common['Authorization'] = "Bearer "+auto;
     
      Vue.axios.post(api.SYS_MENU_LIST,headers).then(res => {
       let impSid = localStorage['imp-sid'];
       //console.log(impSid);
       //console.log("获取菜单信息")
        if(!res|| typeof res ==="undefined"){
          window.localStorage.removeItem('imp-sid');
          router.push({path: '/login'});
          return false;
        }
        //console.log('菜单列表ORG',res.data.result.permissions);
        let userAuth = window.localStorage.getItem("userAuth");
            userAuth = JSON.parse(userAuth);
            //debugger
            //console.log("输出菜单列表FFF：");
            //console.log(userAuth);
        let allListDatas = defaultValue.menuListNew;
        let newLists = [];
        allListDatas.forEach((ele,index)=>{
          if(index===0){
            newLists.push(ele);
          }
          var obj ={}
          userAuth.forEach((list,lindex)=>{
              if(list === ele.name){
                obj.name = ele.name;
                obj.displayName = ele.displayName;
                obj.isGranted =ele.isGranted;
                obj.href = ele.href;
                obj.icon = ele.icon;
                obj.isShow = ele.isShow;
                obj.children=[];
              }
          })
          ele.children.forEach((child,chindex)=>{
            userAuth.forEach((listNew,lindex)=>{
              //console.log(child.name);
              if(child.name === listNew){
                if(obj.children){
    
                }else{
                  obj.children=[];
                }
                obj.children.push(child);
              }
            });
        })
        if(Object.prototype.hasOwnProperty.call(obj,'displayName')){
          newLists.push(obj);
          }
        });
        // console.log('菜单列表：',newLists)
        // console.table(types.LOAD_MENU);
        //console.log("输出新生成的菜单：")
        //console.log(newLists);
       
        return newLists||[];
      }).then((res)=>{
        //console.log(res);
        //console.log(commit)
        //commit(types.LOAD_MENU, res);
        commit(types.LOAD_MENU, defaultValue.menuListNew)
      }).catch(exp => {
        //commit(types.LOAD_MENU, defaultValue.menuListNew)
        //console.log("输出错误信息》》》")
        console.log(exp)
      });
    },
    changeCurrentMenu: ({state,commit},{path,matched,fullPath}) => {
      // console.log('获取state:',state)
      const a = getCurrentMenu(fullPath,state.menuList);
      commit(types.LOAD_CURRENT_MENU, a.reverse());
    },
    setUserInfo:({commit})=>{
      commit(types.SET_USER_INFO)
    }
  },
})

export default store
