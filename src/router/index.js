import Vue from "vue";
import VueRouter from "vue-router";
import routeConfig from "./routes";
import {sync} from "vuex-router-sync";
import store from "../store";
import types from "../store/mutation-types";
import auth from "../utils/auth";

//加载路由中间件
Vue.use(VueRouter)

//定义路由
const router = new VueRouter({
  routes: routeConfig,
  mode: 'hash'
})

sync(store, router)

const {state} = store

router.beforeEach((route, redirect, next) => {
  //console.log(router);
  const isLogin = localStorage['imp-sid'] ? true : false;

  //debugger
  if (state.device.isMobile && state.sidebar.opened) {
    store.commit(types.TOGGLE_SIDEBAR, false)
  }
  console.log(route)
  console.log(!auth.loggedIn() && route.path !== '/login')

  if(route.matched.some(record => record.meta.requireAuth)){
    console.log(auth.loggedIn());
    if (!auth.loggedIn()) {
      next({
          path: '/login',
          query: {
              redirect: route.fullPath
          }
      })
  } else {
      if (redirect.path === '/' && route.path === '/') {
          console.log('bb', auth.loggedIn())
          next({
              path: '/index',
              query: {
                  redirect: route.fullPath
              }
          })
      } else {
          console.log(123)
          //isLogin ? next() : next('/login')
          next()
      }
  }
  }else{
   next()
  }

})

export default router

