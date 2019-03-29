<template>
  <header class="main-header animated" :class="{closeLogo:sidebar.collapsed,mobileLogo:device.isMobile}">
    <div @click="gotoIndex" class="logo">
      <span class="logo-lg" >
        <!-- <i class="fa fa-diamond main-color"></i> -->
        <img :src="ycLogo"  class="logo-img-yc">
        &nbsp; 
        <b class="main-color">{{staticDatas.websiteNameText}}</b></span>
    </div>
    <nav class="navbar">
      <a href="#" class="sidebar-toggle  main-color" data-toggle="offcanvas" role="button"
         @click.stop.prevent="toggleMenu(!sidebar.collapsed,device.isMobile)">
        <span class="sr-only">Toggle navigation</span>
      </a>
      <div class="navbar-custom-menu margin-left-10 margin-right-10">
        <div  class="navbar-dropdown">
          <div class="el-dropdown-link  main-color" style="height: auto;line-height: inherit"   @click="logout">
            <i class="fa fa-power-off "></i><span  class="margin-left-3">退出</span>
          </div>
        </div>
      </div>
      <div class="navbar-custom-menu ">
        <div   class="navbar-dropdown">
          <div class="el-dropdown-link   main-color">
            <i class="fa fa-user" aria-hidden="true"></i><span class="margin-left-3">
              <template v-if="userInfo && userInfo.name">{{userInfo.name}}</template>
              <template v-else>佚名</template>
              </span>
          </div>
         
        </div>
      </div>
      
    </nav>

  </header>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import types from "../../store/mutation-types"
  import * as api from "../../api"
  import  auth from '../../utils/auth'
  import * as sysApi from '../../services/sys'
  import {staticDatas} from '../../lang/static_datas.js'
 
  export default {
    data(){
      return {
        staticDatas:staticDatas,
        showMessageBox: false,
        showProfileBox: false,
        list: [],
        count: 4,
        show:true,
        ycLogo:require("../../../static/img/logo-yc.png")
      }
    },
    computed: mapGetters({
      sidebar: 'sidebar',
      userInfo: 'userInfo',
      device:'device',
    }),
    methods: {
      gotoIndex(){
        this.$router.push({path: '/index'});
      },
      toggleMenu(collapsed,isMobile){
        console.log('点击toggle更新state')
        if(isMobile){
          this.toggleSidebarShow();
        }else{
          this.toggleSidebar();
        }
      },
      logout(){
        // this.$http.get(api.LOGOUT)
        //   .then(res => {
        //     auth.logout();
        //     this.$http.defaults.headers.common['Authorization'] = '';
        //     this.$router.push({path: '/login'});
        //   }).catch(error => {
        //     auth.logout();
        //     this.$http.defaults.headers.common['Authorization'] = '';
        //     this.$router.push({path: '/login'});
        // })
            auth.logout();
            this.$http.defaults.headers.common['Authorization'] = '';
            // this.$router.push({path: '/login'});
             this.$router.replace('/login');
             window.location.reload();
            //this.toggleMenu(!this.sidebar.collapsed,this.device.isMobile);
      },
      ...mapMutations({
        toggleSidebar: types.TOGGLE_SIDEBAR,
        toggleSidebarShow: types.TOGGLE_SIDEBAR_SHOW,
        setUserInfo: types.SET_USER_INFO,
      }),
      toggleMessage(){
        this.showMessageBox = !this.showMessageBox;
      },
      toggleProfile(){
        this.showProfileBox = !this.showProfileBox;
      },
      autoHide(evt) {
        if (!this.$el.querySelector('li.messages-menu').contains(evt.target)) {
          this.showMessageBox = false
        }
        if (!this.$el.querySelector('li.user-menu').contains(evt.target)) {
          this.showProfileBox = false
        }
      }
    },
    created(){
      let item = window.sessionStorage.getItem("user-info");
      // debugger
      console.log('输出用户信息：',item)
      if (!!item){
        console.log('输出用户信息：')
        console.log(item)
        
          this.setUserInfo(JSON.parse(item));
      }else if(!item){
        window.localStorage.clear();
        window.sessionStorage.clear();
        this.$router.push({
          path:'/login',
          redirect:""
        })
      }
      //设置头部获取消息列表
      // this.count = 0;
      // this.list = [];
      // sysApi.msgList()
      //   .then(res => {
      //       if (res && res.length>0){
      //           this.count = res.length;
      //           this.list = res;
      //       }
      //   })
    },
    mounted() {
      // document.addEventListener('click', this.autoHide, false)
    },
    destroyed() {
      //document.removeEventListener('click', this.autoHide, false)
    },
    watch:{
      userInfo(val){
        //console.log("输出个人信息",val);
      }
    }
  }
</script>
<style scoped>
.logo-img-yc{
  width: 20px;
  position: relative;
  top: 4px;
}
  .animated {
    animation-duration: .2s;
  }

  .main-header a {
    text-decoration: none;
    /* color: #48576a; */
  }

  .main-header {
    position: fixed;
    min-width: 100%;
    box-shadow: 0 2px 3px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
    z-index: 1999;
    animation-name: slideInDown;
    animation-fill-mode: both;
    color: #48576a;
  }

  .main-header .navbar .sidebar-toggle {
    float: left;
    background-color: transparent;
    background-image: none;
    padding: 15px 15px;
    font-family: fontAwesome;
    line-height: 20px;
  }

  .main-header .navbar .sidebar-toggle:before {
    content: "\f03b";
  }

  .main-header {
    background-color: #ffffff;
  }

  .main-header .logo {
    -webkit-transition: width 0.3s ease-in-out;
    -o-transition: width 0.3s ease-in-out;
    transition: width 0.3s ease-in-out;
    display: block;
    float: left;
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    text-align: center;
    width: 230px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: 0 15px;
    font-weight: 300;
    overflow: hidden;
    text-decoration: none;
  }

  .main-header .logo .logo-lg {
    display: block;
    height: 38px;
    line-height: 38px;
    margin-top: 6px;
  }

  .main-header .navbar {
    -webkit-transition: margin-left 0.3s ease-in-out;
    -o-transition: margin-left 0.3s ease-in-out;
    transition: margin-left 0.3s ease-in-out;
    margin-bottom: 0;
    margin-left: 230px;
    border: none;
    min-height: 50px;
    border-radius: 0;
    background-color: #ffffff;
  }

  .layout-top-nav .main-header .navbar {
    margin-left: 0;
  }


  body.hold-transition .main-header .navbar,
  body.hold-transition .main-header .logo {
    -webkit-transition: none;
    -o-transition: none;
    transition: none;
  }

  .main-header .navbar .sidebar-toggle {
    display: block;
  }

  .main-header .navbar .sidebar-toggle:hover {
    background: #f9f9f9;
  }

  .main-header .logo {
    border-bottom: 0 solid transparent;
  }


  @media (max-width: 800px) {

    .main-header .logo {
      display: none;
    }

    .main-header .navbar {
      margin: 0;
    }

    .main-header .logo, .main-header .navbar {
      width: 100%;
      float: none;
    }

  }
  .main-header.closeLogo .navbar{
    margin-left: 44px;
  }

  .main-header.closeLogo .logo{
    width: 44px;
    padding: 0 8px;
  }
  .main-header.closeLogo .logo .logo-lg b{
    display: none;
  }
  .main-header.closeLogo .sidebar-toggle {
    background: #f9f9f9;
  }

  .main-header.closeLogo .navbar .sidebar-toggle:before {
    content: "\f03c";
  }

  .main-header.mobileLogo .navbar .sidebar-toggle:before {
    content: "\f03a";
  }

  .navbar-custom-menu{
    float: right;
  }

  .navbar-custom-menu .el-dropdown-link{
    cursor: pointer;
    height: 50px;
    padding: 13px 5px;
    min-width: 50px;
    text-align: center;
  }
  .navbar-custom-menu .el-dropdown-link img{
    background-color: #108ee9;
  }

  .navbar-custom-menu .el-dropdown-link:hover{
    background: #f9f9f9;
  }
  .message-list {
    list-style: none;
    padding: 0 10px;
  }
  .message-list li{
    list-style: none;
    height: 25px;
    line-height: 25px;
  }
  .message-list li a{
    text-decoration: none;
    color: #666666;
  }
  .message-list li:hover{
    background-color: #f9f9f9;
  }

  .el-dropdown-menu .header-pic{
    text-align: center;
    /* background-color: #108ee9; */
    padding: 20px;
  }
  .el-dropdown-menu .header-pic img{
    vertical-align: middle;
    height: 90px;
    width: 90px;
    border: 3px solid;
    border-color: transparent;
    border-color: hsla(0,0%,100%,.2);
    /* background-color: #108ee9; */
  }
  .el-dropdown-menu .header-pic p{
    font-size: 1.5rem;
    color: #ffffff;
  }
  .el-dropdown-menu .pull-left{
    background-color: #f9f9f9;
    padding: 10px;
    display: inline-block;
    float: left;
  }
  .el-dropdown-menu .pull-right{
    background-color: #f9f9f9;
    padding: 10px;
    float: right;
    display: inline-block;
  }

</style>
