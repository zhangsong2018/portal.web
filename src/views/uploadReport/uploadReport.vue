<template>
   <imp-panel :title="form.id ? '编辑报表':'新增报表'">
    <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <el-form ref="form" :model="form" label-width="180px">
             <el-form-item label="上传财务报表">
                <el-upload
                  class="upload-file"
                  ref="upload"
                  :action="HOSTUPLOAD"
                  :limit="10"
                  :auto-upload="true"
                  :multiple="false"
                  :on-success="handleSuccess"
                  :file-list="form.attachments" 
                  :before-upload="checedkFiles"                 
                  >                           
                   <template>
                      <el-button slot="trigger" size="small" type="success">选取文件</el-button>
                   </template>
                   <template slot="tip">
                     <div class="font-size-12 color-999">
                     上传报表类型只能是xlsx或xlsm
                     </div>
                     </template>
                </el-upload>
             </el-form-item>
                        
          </el-form>
        </el-card>
    </el-col>
  </imp-panel>
</template>

<script>
  import * as api from "../../api"
  import 'babel-polyfill'; // es6 shim
  import Vue from 'vue';
  import myUpload from 'vue-image-crop-upload';
  import *as sysApi from '../../services/sys'
  import {HOSTUPLOAD,isLt20M,limitFilesType,limitFilesTypeText}from '../../config/config'
  export default {
    name: "uploadReport.vue",
    data(){
      return {
        form: {        
          fileNames:"",
          attachments:[],          
        },
        HOSTUPLOAD:HOSTUPLOAD+'/api/file/uploadone',
        attachments:[]
      }
    },
    methods: {
      handleSuccess(res, file, fileList){//上传成功
      	//if()
        if(!res){
          this.logOff()
          return false;
        }
        if(res.success){
          this.fileNames = res.result.fileNames[0];  
          sysApi.uploadReport({fileNames:this.fileNames})
          .then(response=>{
		      if(response && response.data){
			    this.$message({
	              type:'success',
	              message:'上传成功'
	            })
		      }      
		    },err=>{
		      this.$message({
	             type:'error',
	             message:'服务器异常'
              })
		    }).catch((error)=>{
		      this.$message({
	             type:'error',
	             message:'服务器异常'
              })
		    })  
        }
        
      },
      checedkFiles(file){
        if(this.form.attachments.length>10){
          this.$message.warning("最多上传10个文件")
          return false;
        }

        var filetype=file.name.substring(file.name.lastIndexOf('.')+1);
        const extension = filetype === limitFilesType.xlsx;
        const extension1 = filetype === limitFilesType.xlsm;

        const isLt10 = file.size / 1024 / 1024 < isLt20M;
          if(!isLt10){
            this.$message.warning('文件不能大于20M');
            return false;
          }
          if(!extension && !extension1){
            this.$message.warning('请上传xlsx或xlsm类型的文件');
            return false;
          }
      },
      
      
   }

  }
</script>

<style scoped>

</style>
