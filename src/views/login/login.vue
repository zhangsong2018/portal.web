<template lang="html">
  <el-row>
    <el-col :span="12" :offset="6">
      <div class="login main-color-bg dector">
      <el-row slot="body" :gutter="0" >
      <el-col :span="24" :xs="24" :sm="16" :md="16" :lg="16">
        <div class="login-form">
          <div class="card-block">
             <h1>Portal后台管理系统</h1>
            <p class="text-muted">用户名、密码登录</p>
            <!-- <h1>{{staticDatas.websiteNameText}}</h1> -->
            <!-- <p class="text-muted">{{staticDatas.loginTips}}</p> -->
            <div class="input-group m-b-1">
              <span class="input-group-addon main-color-bg"><i class="fa fa-user"></i></span>
              <input type="text" class="form-control" placeholder="用户名" v-model="form.parameter1"   :maxLength="maxLength">
            </div>
            <div class="input-group m-b-2">
              <span class="input-group-addon main-color-bg"><i class="fa fa-lock"></i></span>
              <input type="password" class="form-control" placeholder="密码" v-model="form.parameter2"
                     @keyup.enter="login"  :maxLength="maxLength">
            </div>
            <div class="row">
              <el-row>
                <el-col :span="12">
                  <el-button type="primary" class="btn btn-primary p-x-2" @click="login">登录</el-button>
                </el-col>
                <el-col :span="12">
                  <!-- <el-button type="button" class="btn btn-link forgot" style="float:right;">忘记密码?</el-button> -->
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        </el-col>
      <el-col :span="24" :xs="24" :sm="8" :md="8" :lg="8">
        <div class="login-register main-color-bg">
          <!-- <div class="card-block">
            <h2>注册</h2>
            <p>暂时不只支注册，请联系运营人员</p>
            <el-button  class="btn btn-primary active m-t-1" disabled> 马上注册</el-button>
          </div> -->
        </div>
        </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>

  import types from '../../store/mutation-types'
  import * as api from "../../api"
  import  auth from '../../utils/auth'
  import * as sysApi from '../../services/sys'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {staticDatas} from '../../lang/static_datas'
  import {maxLength} from '../../config/config'
  export default {
    name: 'login',
    data() {
      return {
        maxLength:maxLength,
        staticDatas:staticDatas.login,
        form: {
          //grant_type:"password",//授权类型固定不可修改
          parameter1:"",//	资源所有者用户名
          parameter2:"",//	资源所有者密码
          //client_id:"ro.client",	//接入方客户ID
          //client_secret:"secret",	//接入方客户密码
          //scopes:"StaffInfo"//	请求的资源范围
        }
      }
    },
    components: {},
    methods: {
      ...mapMutations({
        setUserInfo: types.SET_USER_INFO
      }),
      ...mapActions({
        load: 'loadMenuList' // 映射 this.load() 为 this.$store.dispatch('loadMenuList')
      }),
      login(){
        var redirectUrl = '/index';
        //debugger
        if (this.$route.query && this.$route.query != null && this.$route.query.redirect && this.$route.query.redirect != null) {
          redirectUrl = this.$route.query.redirect;
        } 
        if(this.form.parameter1===""){
          this.$message.error("用户名不能为空！")
          return false
        }
        if(this.form.parameter1.length<6){
          this.$message.error("用户名不能小于6位数！")
          return false
        }
        if(this.form.parameter1.length>25){
          this.$message.error("用户名不能大于25位数！")
          return false
        }
        if(this.form.parameter2===""){
          this.$message.error("密码不能为空！")
          return false
        }
        if(this.form.parameter2.length<6){
          this.$message.error("密码不能小于6位数！")
          return false
        }
        if(this.form.parameter2.length>25){
          this.$message.error("密码不能大于25位数！")
          return false
        }

        sysApi.login(this.form).then(res => {
            if(!!res){
                if(!res.result){
                    this.$message.error("登录失败！");
                    return false;
                }
                let result = res.result.tokenResultMsg;
                 if(!result){
                   this.$message.error(res.result.message);
                    return false;
                 }
                if(!result.access_token){
                  this.$message.error("登录失败！");
                  return false;
                }
            }else{
              this.$message.error("登录失败！");
              return false;
            }
            let resNew = res.result.tokenResultMsg;
            let sid = resNew.access_token;
            let tempExpires = resNew.expires_in;
            let tokenType = resNew.token_type;
            let user={
              name:this.form.parameter1,
              tempExpires:tempExpires,
              tokenType:tokenType
            };
            let objNew = {sid,user}
            this.loginSuccess({...objNew,redirectUrl})
        })
    },
    loginSuccess({sid,user,redirectUrl}){

        auth.login(sid);
        window.sessionStorage.setItem("user-info", JSON.stringify(user));
        this.setUserInfo(user);
        
        this.$http.defaults.headers.common['Authorization'] = "Bearer "+sid;
        //获取用户权限
        sysApi.getUses().then((res)=>{
          if(!!res){
            window.localStorage.setItem("userAuth",JSON.stringify(res.result))
          }
        }).then(()=>{
          this.load();
          //this.$store.dispatch('loadMenuList')
          if(redirectUrl === "/"){
              redirectUrl="/index";
          }
          redirectUrl && this.$router.push({path: redirectUrl});
        })
      },
    }
  }
</script>

<style scoped>
  .login {
    margin-top: 160px;
    width: 100%;
    border: 1px solid #cfd8dc;
    margin-right: auto !important;
    margin-left: auto !important;
    display: table;
    table-layout: fixed;
  }

  .login .el-button {
    border-radius: 0;
  }

  .login .el-button.forgot, .login .el-button.forgot:hover {
    border: none;
  }

  .login .login-form {
    background-color: #FFFFFF;
    width: 100%;
    height: 100%;
    display: block;

  }

  .login .login-form .card-block {
    padding: 35px;
  }

  .login .login-form .card-block p {
    margin: 15px 0;
  }

  .input-group {
    width: 100%;
    display: table;
    border-collapse: separate;
    margin-bottom: 20px !important;
  }

  .input-group, .input-group-btn, .input-group-btn > .btn, .navbar {
    position: relative;
  }

  .input-group-addon:not(:last-child) {
    border-right: 0;
  }

  .input-group-addon, .input-group-btn {
    min-width: 40px;
    white-space: nowrap;
    vertical-align: middle;
    width: 1%;
  }

  .btn-link:focus, .btn-link:hover {
    color: #167495;
    text-decoration: underline;
    background-color: transparent;
  }

  .btn-link, .btn-link:active, .btn-link:focus, .btn-link:hover {
    border-color: transparent;
  }

  .btn.focus, .btn:focus, .btn:hover {
    text-decoration: none;
  }

  .input-group-addon {
    padding: .5rem .75rem;
    margin-bottom: 0;
    font-size: .875rem;
    font-weight: 400;
    line-height: 1.75rem;
    color: #fff;
    text-align: center;
    opacity: 0.8;
  }

  .input-group .form-control, .input-group-addon, .input-group-btn {
    display: table-cell;
  }

  .input-group .form-control {
    position: relative;
    z-index: 2;
    float: left;
    margin-bottom: 0;
  }

  .form-control {
    width: 90%;
    padding: .5rem .75rem;
    font-size: 1.5rem;
    line-height: 1.75rem;
    background: #fff none;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }

  .login .login-form .card-block .row {
    display: block;
    margin: 15px 0;
  }

  .login .login-register {
    width: 100%;
    height: 100%;
    display: block;
    background-color:  main-color-bg;
    color: #fff;
  }

  .login .login-register .card-block {
    text-align: center !important;
    padding: 30px;
  }

  .login .login-register .card-block p {
    text-align: left !important;
    margin: 15px 0;
    height: 100px;
  }
  .dector{
    box-shadow: 0 0 6px #eee;
    border-radius: 6px;
    overflow: hidden;
  }
</style>
