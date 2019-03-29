<template>
  <imp-panel :title="form.id ? '编辑':'新增角色'">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="角色">
        <el-input v-model="form.DisplayName" :maxlength="maxlength"  class="input-width-50p" placeholder="请输入角色"></el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.Name" :maxlength="maxlength" class="input-width-50p" placeholder="请输入编码"></el-input>
      </el-form-item>
      <el-form-item>
        <template v-if="contolAuth && (contolAuth['Administration.Roles.Edit'])">
        <el-button type="primary" @click="onEditSubmit" v-if="form.id"  size="small" >保存</el-button>
        <el-button  @click="onCancel"  size="small"  v-if="form.id" >取消</el-button>
        </template>
        <template v-if="contolAuth && (contolAuth['Administration.Roles.Create'])">
           <el-button type="primary" @click="onSubmit" v-if="!form.id"  size="small" >保存</el-button>
            <el-button  @click="onCancel"  size="small" v-if="!form.id" >取消</el-button>
        </template>
        
        
       
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import {headers,maxLength} from '../../config/config'
  import {stringIsNull,stringTrimeFn,contolAuth} from '../../utils/utils'
  //import $ from 'jquery'
  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        contolAuth:contolAuth(),
        maxlength:maxLength,
        form:{
          DisplayName: '',
          Name: ''
        }
      }
    },
    created(){
      this.loadData();
    },
    methods: {
      onSubmit(){
        let name = this.form.Name;
        let displayName = this.form.DisplayName
        if(!stringIsNull(name)){
            this.$message.error('编码不能为空')
            return false;   
        }
        if(!stringIsNull(displayName)){
          this.$message.error('角色不能为空')
          return false;
        }
        //字符串去前后空格
        // this.form.Name = stringTrimeFn(this.form.Name);
        // this.form.displayName = stringTrimeFn(this.form.displayName);
        //提交
        this.commSubmitFn();
      },
      onEditSubmit(){
        let name = this.form.Name;
        let displayName = this.form.DisplayName
        if(!stringIsNull(name)){
            this.$message.error('编码不能为空')
            return false;   
        }
        if(!stringIsNull(displayName)){
          this.$message.error('角色不能为空')
          return false;
        }
        //字符串去前后空格
        // this.form.Name = stringTrimeFn(name);
        // this.form.displayName = stringTrimeFn(displayName);
        //提交
         this.commSubmitFn();
      },
      onCancel(){
          console.log('取消')
          // this.$confirm('您确定取消吗？','提示',{
          //           confirmButtonText: '确定',
          //           cancelButtonText: '取消',
          //           type:'warning'
          //       }).then(()=>{
                    
          //       }).catch((err)=>{
          //           console.log(err)
          //       })
          this.$router.push({path: 'roleList'})
      },
      loadData(){
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
          this.form.id = this.$route.query.id; 
          this.form.DisplayName=this.$route.query.DisplayName||'',
          this.form.Name=this.$route.query.Name||''
        }
      },
      //编辑和新增的公用函数
      commSubmitFn(){
        // this.$http.post(api.SYS_ROLE,this.form, headers).then((res) => {
        //   console.log(res)
        //   // if(!res){
        //   //   this.$message.error("角色编码重复,请更换编码")
        //   //   return false
        //   // }
        //   //  if(!res){
        //   //     this.logOff()
        //   //     return false;
        //   //   }

        //     if(res.data.success){
        //       //debugger
        //       this.$message.success("保存成功")
        //       this.$router.push({path: 'roleList'})
        //     }else{
        //       this.$message.error(res.data.error.message)
        //     }
        //     //debugger
        //   },(res)=>{
        //     console.log(res);
        //   }).catch((err)=>{
        //     console.log('112',err)
        //   })

        // let headersAuto = window.localStorage.getItem('imp-sid');
        // let url = this.url;
        // let that = this;
        // $.ajax({
        //   url:url+"/"+api.SYS_ROLE,
        //   method:"post",
        //   dataType:"JSON",
        //   headers: {
        //     'Content-Type': 'application/json;charset=UTF-8',
        //     "Authorization":"Bearer "+headersAuto
        // },
        //   data:JSON.stringify(that.form),
        //   success:function(res){
        //      if(res.result){
        //       that.$message.success("保存成功")
        //       that.$router.push({path: 'roleList'})
        //     }
        //   },error:function(res){
        //    let error =  res.responseJSON
        //     if(res.status===500){
        //       console.log(error)
        //       that.$message.error(error.error.message);
        //     }
        //     if(res.status===401){
        //         that.logOff()
        //         return false;
        //     }
        //   }
        // })
         this.$http.post(api.SYS_ROLE,this.form, headers).then((res) => {
            console.log(res);
            if(res && res.data && res.data.success){
              this.$message.success("保存成功")
              this.$router.push({path: 'roleList'})
            }
          },(err)=>{
            // console.log('捕获错误：')
            // console.log(err)
            // console.log(err.response)
            // if(err && err.response && err.response.status ===500){
            //     this.$message.error(err.response.data.error.message);
            // }
            // if(err && err.response && err.response.status ===401){
            //   debugger
            //   this.logOff();
            // }
          }).catch((err)=>{
            console.log(err)
          })
      }
    }
  }
</script>

