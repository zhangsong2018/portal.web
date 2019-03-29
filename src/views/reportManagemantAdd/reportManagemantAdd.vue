<template>
  <imp-panel :title="form.id ? '编辑报表':'新增报表'">
    <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <el-form ref="form" :model="form" label-width="180px">
            <el-form-item label="名称">
                <el-input v-model="form.name" auto-complete="off" class="input-width-50p" placeholder="请填写名称"   size="small"></el-input>
            </el-form-item> 
            <el-form-item label="开始时间" >
                  <span icon="el-icon-time"></span><el-date-picker 
                        v-model="form.startDate"
                        type="datetime"
                        default-time="08:00:00"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        range-separator="至"
                        placeholder="开始日期"   size="small">
                    </el-date-picker>
             </el-form-item>
              <el-form-item label="结束时间">
                  <span icon="el-icon-time"></span><el-date-picker 
                        v-model="form.endDate"
                        default-time="08:00:00"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        type="datetime"
                        range-separator="至"
                        placeholder="结束时间"   size="small">
                    </el-date-picker>
             </el-form-item>
             <el-form-item label="上传资料">
                <el-upload
                  class="upload-file"
                  ref="upload"
                  :action="HOSTUPLOAD"
                  :limit="10"
                  :auto-upload="true"
                  :multiple="false"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :file-list="form.attachments"
                  :on-preview="handleListDownLoad"
                  :before-upload="checedkFiles"

                  >
                  
                  <template v-if="contolAuth && contolAuth['WorkBench.Report.Create']">
                      <el-button slot="trigger" size="small" type="success">选取文件</el-button>
                   </template>
                   <template v-else>
                      <el-button slot="trigger" size="small" type="success">选取文件</el-button>
                   </template>
                   <template slot="tip">
                     <div class="font-size-12 color-999">
                     点击文件列表的每一项可下载文件,鼠标滑过列表点击删除可删除文件
                     </div>
                     </template>

                   

                </el-upload>
             </el-form-item>
             <el-form-item label="报表类型">
                <el-input v-model="form.typeName" auto-complete="off" class="input-width-50p" disabled   size="small"></el-input>
                

                <template v-if="contolAuth && contolAuth['WorkBench.Report.Create']">
                  <el-button type="primary" @click="onSubShow()"   size="small" class="margin-left-10">选择</el-button>
                </template>
                <template v-else>
                  <el-button type="primary" @click="onSubShow()"   size="small"  class="margin-left-10">选择</el-button>
                </template>

             </el-form-item> 
             <el-form-item label="备注">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="form.memo"
                    class="input-width-50p" 
                    :maxlength="maxLengthUrl"
                    >
                </el-input>
             </el-form-item> 
             
             <el-form-item>
               <template v-if="contolAuth && contolAuth['WorkBench.Report.Edit']">
                  <el-button type="primary" @click="onEditSubmit" v-if="form.id"   size="small">保存</el-button>
                  <el-button  @click="onCancel"  v-if="form.id"   size="small">取消</el-button>
               </template>

            <!--   <el-button  type="primary" @click="submitToAuditing"  v-if="form.id">提交审批</el-button> -->
               <template v-if="contolAuth && contolAuth['WorkBench.Report.Create']">
                  <el-button type="primary" @click="onSubmit" v-if="!form.id"   size="small">立即创建</el-button>
                  <el-button  @click="onCancel" v-if="!form.id"   size="small">取消</el-button>
               </template>

              <!-- <el-button  @click="onCancel" >取消</el-button> -->
              
            </el-form-item>
             <el-dialog title="关联类型" :visible.sync="visibleShow">
               <el-tree v-if="resourceTree"
                       ref="resourceTree"
                       :data="resourceTree"            
                       highlight-current
                       :render-content="renderContent"
                       @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps" class="my-rep-tree"></el-tree>
                       <div style="height: 40px">
                         <el-button  @click="onsubmits" type="primary" style="float: right;margin: 15px"   size="small">确定</el-button>
                       </div>
                       
            </el-dialog>
          </el-form>
        </el-card>
    </el-col>
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import 'babel-polyfill'; // es6 shim
	import Vue from 'vue';
  import myUpload from 'vue-image-crop-upload';
  import *as sysApi from '../../services/sys'
  import merge from 'element-ui/src/utils/merge';
  import {contolAuth} from '../../utils/utils'
 import {
  HOSTUPLOAD,
  isLt20M,
  limitFilesType,
  limitFilesTypeText,limitImgTypeText,maxLengthUrl}from '../../config/config'

  console.log(contolAuth)

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        contolAuth:contolAuth(),
         HOSTUPLOAD:HOSTUPLOAD+'/api/file/uploadone',
         maxLengthUrl:maxLengthUrl,
        form: {
          name:'',
          startDate:'',
          endDate:"",
          typeId:"",
          typeName:"",   
          memo:"",
          State:0,
          fileNames:"",
          attachments:[],          
        },
        visibleShow:false,
        resourceTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        typelist:{},
        attachments:[]
      }
    },
    created(){
      this.loadData();
    },
    methods: {
      handleSuccess(res, file, fileList){//上传成功
        if(!res){
          this.logOff()
          return false;
        }
        if(res.success){
          this.fileNames = res.result.fileNames[0];  
          this.attachments.push({
            "fileName":this.fileNames,
            "fileType":0,
            "name":file.name
          })       
        }
        
      },
      handleListDownLoad(file){
        if(file){
          if(file.id && file.status==="success"){
            //已经上传的文件允许下载
            let files  = file.fileName.toString().substring(0,8);
            window.open(HOSTUPLOAD+'/UploadFiles/'+files+"/"+file.fileName)
          }else{
            //如果是刚上传的文件下载fileNames[0]
            let currentUpload = file.response
            if(currentUpload  && file.status && currentUpload.result.fileNames.length>0 && currentUpload.result.fileNames[0]){
                 let files  = currentUpload.result.fileNames[0].toString().substring(0,8);
                 window.open(HOSTUPLOAD+'/UploadFiles/'+files+"/"+currentUpload.result.fileNames[0])
            }else{
              this.$message.error("文件不存在请刷新重试");
            }
          }
        }
      },
      checedkFiles(file){
        console.log(file);
        console.log(this.form.attachments);
        if(this.form.attachments.length>10){
          this.$message.warning("最多上传10个文件")
          return false;
        }

        var filetype=file.name.substring(file.name.lastIndexOf('.')+1);
        const extension = filetype === limitFilesType.png;
        const extension2 = filetype === limitFilesType.jpg;
        const extension3 = filetype === limitFilesType.jpeg;
        const extension4 = filetype === limitFilesType.doc;
        const extension5 = filetype === limitFilesType.docx;
        const extension6 = filetype === limitFilesType.xls;
        const extension7 = filetype === limitFilesType.xlsx;
        const extension8 = filetype === limitFilesType.ppt;
        const extension9 = filetype === limitFilesType.pptx;
        const extension10 = filetype === limitFilesType.pdf;
        const extension11 = filetype === limitFilesType.html;

        const isLt10 = file.size / 1024 / 1024 < isLt20M;
          if(!isLt10){
            this.$message.warning('文件不能大于20M');
            return false;
          }
          if(!extension&&!extension2&&!extension3 &&!extension4&&!extension5&&!extension6&&!extension7&&!extension8&&!extension9&&!extension10&&!extension11){
            this.$message.warning('请上传'+limitFilesTypeText+'类型的文件');
            return false;
          }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        var _this = this;
        this.attachments.forEach(function(item,i){
          if(item.name == file.name){
            _this.attachments.splice(i, 1);
          }
        })
        console.log(this.attachments)
      },  
      onsubmits(){
        this.visibleShow = false;
        this.form.typeId = this.typelist.id;
        this.form.typeName = this.typelist.name
      },
      handleNodeClick(data){
        console.log(data);
        this.typelist = merge({}, data); //修改
      },
      onSubShow(){
         this.visibleShow = true;
         this.load();
      },
      load(){ //资源列表
        sysApi.resourceList()
          .then(res=>{
            this.resourceTree = [];
            this.resourceTree.push(...res)
            console.log(res)
          })
      },    
      onSubmit(){
        var url = this.url;
        if(this.form.name == ""){
           this.$message({
              type:'warning',
              message:'报表名称不能为空'
           })
           return
        }
        if(this.form.startDate == "" || this.form.startDate == 0 || this.form.startDate==null){
           this.$message({
              type:'warning',
              message:'开始时间不能为空'
           })
           return
        }
         if(this.form.endDate == "" || this.form.endDate == 0 ||this.form.endDate==null){
           this.$message({
              type:'warning',
              message:'结束时间不能为空'
           })
           return
        }
         if(this.form.typeName == ""){
           this.$message({
              type:'warning',
              message:'报表类型不能为空'
           })
           return
        }
         let startTime = new Date(this.form.startDate).getTime();
         let endTime = new Date(this.form.endDate).getTime();
         if(startTime>endTime){
           this.$message.error("结束时间不能小于开始时间");
           return false;
         }
         //debugger
        console.log(this.form.attachments);
        console.log(this.attachments);
        this.form.attachments = this.attachments;
        this.$http.post(url+"/api/Report/FileReportSave", this.form)
          .then(res => {
            //this.form = res.data;
            if(!res){
              this.logOff()
              return false;
            }
            this.$message({
              type:'success',
              message:'创建成功'
            })
            this.$router.push({path: 'reportManagemantList'})           
          })
      },
      onEditSubmit(){
        var url = this.url;
        if(this.form.name == ""){
           this.$message({
              type:'warning',
              message:'报表名称不能为空'
           })
           return
        }
        if(this.form.startDate == "" || this.form.startDate==0 ||this.form.startDate==null){
           this.$message({
              type:'warning',
              message:'开始时间不能为空'
           })
           return
        }
         if(this.form.endDate == "" || this.form.endDate==0 || this.form.endDate==null){
           this.$message({
              type:'warning',
              message:'结束时间不能为空'
           })
           return
        }
         if(this.form.typeName == ""){
           this.$message({
              type:'warning',
              message:'报表类型不能为空'
           })
           return
        }
         let startTime = new Date(this.form.startDate).getTime();
         let endTime = new Date(this.form.endDate).getTime();
       
         if(startTime>endTime){
           this.$message.error("结束时间不能小于开始时间");
           return false;
         }
         //debugger

        let editAttachments =this.form.attachments.concat(this.attachments);
        let editEndAttachments=[];
        editAttachments.forEach((el,index)=>{
            editEndAttachments.push({
                fileName: el.fileName,
                fileType: 0,
                name: el.name
            })
        }) 
        this.form.attachments = editEndAttachments;
        this.$http.post(url+"/api/Report/FileReportSave", this.form)
          .then(res => {
            //this.form = res.data;  
            if(!res){
              this.logOff()
              return false;
            }       
              this.$message({
                type:'success',
                message:'修改成功'
              })
              this.$router.push({path: 'reportManagemantList'})
            
          })
      },
      downLoad(){
        //下载报表
            let params = {
                id:'12344'
            }
            sysApi.reportDownload(params).then(function(res){
                console.log(res);
                console.log('下载报表');
                if(!res){
                  this.logOff()
                  return false;
                }
            })
      },
      onCancel(){
          this.$confirm('是否返回列表?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.$router.push({path: 'reportManagemantList'})
          })
      },
      loadData(){
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
            this.form.id = this.$route.query.id;
            sysApi.userDetails({
                id: Number(this.$route.query.id)
            })
            .then(res => {
              console.log(res)
              let attachments = res.result.attachments.forEach((el)=>{
                el.name = el.fileName;
              })
              this.form = res.result;
            });
        }
      },         
      renderContent(h, {node, data, store}) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
          </span>);
      },
    },
    components: {
			'my-upload': myUpload
		},
  }
</script>
<style scoped>
.my-img{
  width: 100%;
  max-width: 25%;
}
.el-checkbox__inner{
  display: none;
  width: 0;
  height: 0;
}
.font-size-12{
  font-size: 12px;
} 
.color-999{
  color: #999;
}
</style>


