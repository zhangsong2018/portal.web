<template>
    <imp-panel  :title="'报表审查'">
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div class="text item">
             <el-form :model="detailsDatas" ref="detailsDatas">             
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input v-model="form.name" auto-complete="off" class="input-width-50p"></el-input>
                </el-form-item>
                <el-form-item label="关联指令" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.typeName" auto-complete="off" disabled class="input-width-50p"></el-input>            
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.startDate" auto-complete="off"  disabled class="input-width-50p"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.endDate" auto-complete="off" disabled class="input-width-50p"></el-input>            
                </el-form-item> 
                <el-form-item label="报表类型Id" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.typeId" auto-complete="off"  disabled class="input-width-50p"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.creationTime" auto-complete="off" disabled class="input-width-50p"></el-input>            
                </el-form-item> 
                <el-form-item label="状态" :label-width="formLabelWidth">
                   <template>
                    {{ detailsDatas.state ===1 ? '已审核' : '待审核' }}
                  </template>        
                </el-form-item>



                <el-form-item  label="素材文件" :label-width="formLabelWidth" v-for="item in detailsDatas.attachments"
                  :key="item.id"  v-if="item.fileType == 0" 
                >
                    <template slot-scope="scope">
                      <span>{{item.fileName}}</span>  
                      <el-button @click="downLoad(item)" size="small">下载</el-button>
                    </template>
                </el-form-item>
                <!-- <el-form-item label="审批文件" :label-width="formLabelWidth" v-for="item in detailsDatas.attachments" v-if="item.fileType == 1" :key="item.id">
                    <template slot-scope="scope">
                      <span>{{item.fileName}}</span>  
                      <el-button @click="downLoad(item)" size="small">下载</el-button>
                    </template>
                </el-form-item> -->




                <el-form-item label="上传资料" :label-width="formLabelWidth">
                    <el-upload
                      class="upload-file"
                      ref="upload"
                      :action=HOSTUPLOAD
                      :limit="1"
                      :auto-upload="true"
                      :on-success="handlePreview"
                      :on-remove="handleRemove"
                      :on-exceed='alertText'
                      :before-upload='checedkFiles'
                      :file-list="fileList"
                      :on-preview="handleListDownLoad"

                      >
                       
                          <el-button size="small" type="primary">点击上传</el-button>
                      
                      <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
                          <!-- <ul class="el-upload-list el-upload-list--text">
                            <li tabindex="0" class="el-upload-list__item is-success">
                            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>
                            201812211127290228.jpg
                            </a>
                              <label class="el-upload-list__item-status-label">
                                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                              </label>
                              <i class="el-icon-close"></i>
                              </li>
                          </ul> -->
                    </el-upload>
                </el-form-item>
                <div style="height: 40px;">
                   <div style="float: right;">
                    
                      <el-button  type="primary" @click="submitToAuditing" size="small">提交审批</el-button>
                      <el-button  @click="onCancel" size="small">返回</el-button>
                     
                   </div>
                </div>                
             </el-form>
          </div>
        </el-card>
      </el-col>
    </imp-panel>
</template>
<script> 
 import panel from "../../components/panel.vue"
import *as sysApi from '../../services/sys'
 import {contolAuth} from '../../utils/utils'
 import {
  HOSTUPLOAD, 
  isLt20M,
  limitFilesType,
  limitFilesTypeText}from '../../config/config'

export default {
    components:{
       'imp-panel': panel
    },
    data(){
        return {
        contolAuth:contolAuth(),
        HOSTUPLOAD:HOSTUPLOAD+'/api/file/uploadone',
        detailsDatas: {
        },
        formLabelWidth: '100px',
        fileNames:"",
        fileList:[],
        myAtachments:[],
        form:{
          id:'',
          name:"",
          attachments:[
            // {
            //   fileName:"",
            //   fileType:1,
            // }
          ]
        }
      }
    },
    created(){
      this.loadData();
    },
     methods:{
            loadData(){
                  sysApi.userDetails({
                    id: Number(this.$route.query.id)
                  })
                  .then(res => {
                    if(!res){
                      this.logOff()
                      return false;
                    }
                    console.log(res)
                    this.form.name = res.result.name
                    this.detailsDatas = res.result;
                    this.detailsDatas.startDate = this.dateFormat(res.result.startDate);
                    this.detailsDatas.endDate = this.dateFormat(res.result.endDate);
                    this.detailsDatas.creationTime = this.dateFormat(res.result.creationTime);
                    //将上传资料文件中的审批文件放在审批列表
                    
                    res.result.attachments.forEach((el,index)=>{
                        if(el.fileType===1){
                          console.log(el)
                         let url = el.fileName.toString().substring(0,8)
                          this.fileList.push({
                            fileType:el.fileName,
                            name:el.fileName,
                            url:HOSTUPLOAD+'/UploadFiles/'+url+"/"+el.fileName
                          });
                        }
                    })

                    this.myAtachments = res.result.attachments

                });
            },
            downLoad(item){
               var file = item.fileName.slice(0,8)
               window.open(HOSTUPLOAD+'/UploadFiles/'+file+"/"+item.fileName)

            },
            dateFormat(value){                 
                return value.replace(/T/g, ' ').substring(0,19)                                             
            },
            alertText(){
                this.$message('最多上传一个文件，请删除上传列表文件后再上传！');
            },
            handlePreview(res){
               this.fileNames = res.result.fileNames[0];
               if(res.success){
                  this.myAtachments.forEach((item,index)=>{
                  if(item.fileType ===1){
                    //item.name = res.result.fileNames[0]
                    this.myAtachments.splice(index,1)
                  }
                })
                this.myAtachments.push({
                  fileName:res.result.fileNames[0],
                  fileType:1
                })
               }
               
               
            },
            handleRemove(file){
              console.log(file)
              console.log(this.fileList);

                // this.$confirm("确认删除当前的审批文件吗","标题",{
                //   confirmButtonText: '确定',
                //   cancelButtonText: '取消',
                //   type: 'success'
                // }).then((res)=>{
                //   console.log(res);
                //   //var _this = this;
                //     this.fileList.forEach((item,i)=>{
                //       if(item.name == file.name){
                //         this.fileList.splice(i, 1);
                //       }
                //     })
                //   this.form.attachments[0].fileName="";
                //   console.log('输出文件列表：',this.fileList);
                // }).catch((res)=>{


                //     console.log(file);
                //     if(file.status==="success"){
                //         if(file.response){
                //           let  myFilenames = file.response.result.fileNames[0];
                //           this.form.attachments[0].fileName=myFilenames;
                //           this.form.attachments[0].fileType=1;
                //           this.fileList.name = myFilenames;
                //           let url = myFilenames.substring(0,8);
                //           this.fileList.url = HOSTUPLOAD+'/UploadFiles/'+url+"/"+myFilenames;
                //         }else{
                //            this.form.attachments[0].fileName=file.name;
                //            this.form.attachments[0].fileType=1;
                //             this.fileList.url = file.url;
                //             this.fileList.name = file.name;
                //         }
                        
                //         this.$message.info("已取消删除");
                //     }

                // })
                this.fileList.forEach((item,i)=>{
                      if(item.name == file.name){
                        this.fileList.splice(i, 1);
                      }
                    })
                this.form.attachments[0].fileName="";
                console.log('输出文件列表：',this.fileList);

                this.myAtachments.forEach((item,i)=>{
                  if(item.name == file.name){
                        this.myAtachments.splice(i, 1);
                      }
                })

                console.log('暑促原始文件列表：',this.myAtachments)
                
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
            //上传类型判断
            checedkFiles(file){
              console.log(file);
              console.log(this.form.attachments);
              let isUploadsFile =false;
              this.form.attachments.forEach((item)=>{
                if(item.fileType===1){
                  isUploadsFile = true;
                }
              })

              if(isUploadsFile){
                  this.$message.warning("最多只允许上传1个审批文件！！！")
                  return false;
              }
              // if(this.form.attachments.length>1){
              //   this.$message.warning("最多上传1个文件")
              //   return false;
              // }

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
            submitToAuditing(){
                this.form.id = Number(this.$route.query.id);
                //this.form.attachments[0].fileName = this.fileNames;
                this.form.attachments = this.myAtachments;

                let isUploadsFile = false;
                this.form.attachments.forEach((item)=>{
                  if(item.fileType===1){
                    isUploadsFile=true;
                  }
                })


                if(!isUploadsFile){
                  this.$message.error("审核文件不能为空");
                  return false;
                }
                // if(!this.form.attachments[0].fileName){
                //   this.$message.error("审核文件不能为空");
                //   return false;
                // }

                // if(this.form.attachments.length>1){
                //   this.$message.error("审核文件只能有一个");
                //   return false;
                // }


                var url = this.url;
                this.$http.post(url+"/api/Report/FileReportAudited",this.form)
                .then(res => {
                   if(!res){
                    this.logOff()
                    return false;
                  }
                  this.$message({
                    type: 'success',
                    message: '审核成功!'
                  });
                  this.$router.push({path: 'reportManagemantList'})  
                }).catch(() => {
                          
                });
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

        }
}
</script>
<style>

</style>

