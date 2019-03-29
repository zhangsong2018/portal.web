<template>
    <imp-panel  :title="'报表详情'">
      <el-col :span="20" :xs="24" :sm="24" :md="20" :lg="20">
        <el-card class="box-card">
          <div class="text item">
             <el-form :model="detailsDatas" ref="detailsDatas">             
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.name" auto-complete="off"  disabled style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="关联指令" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.typeName" auto-complete="off" disabled style="width: 220px"></el-input>            
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth" >
                  <el-input v-model="detailsDatas.startDate" auto-complete="off" disabled style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.endDate" auto-complete="off"  disabled style="width: 220px"></el-input>            
                </el-form-item> 
                <el-form-item label="报表类型Id" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.typeId" auto-complete="off"  disabled style="width: 220px"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" :label-width="formLabelWidth">
                  <el-input v-model="detailsDatas.creationTime" auto-complete="off" disabled style="width: 220px"></el-input>            
                </el-form-item> 
                <el-form-item label="状态" :label-width="formLabelWidth">
                   <template>
                    {{ detailsDatas.state ===1 ? '已发布' : '待审核' }}
                  </template>        
                </el-form-item>
                <el-form-item label="素材文件" :label-width="formLabelWidth" v-for="item in detailsDatas.attachments" v-if="item.fileType == 0" :key="item.id">
                    <template slot-scope="scope">
                      <span>{{item.fileName}}</span>  
                      <el-button @click="downLoad(item)" size="small">下载</el-button>                              
                    </template>
                </el-form-item>
                <el-form-item label="审批文件" :label-width="formLabelWidth" v-for="item in detailsDatas.attachments" v-if="item.fileType == 1" :key="item.id">
                    <template slot-scope="scope">
                      <span>{{item.fileName}}</span>  
                      <el-button @click="downLoad(item)" size="small">下载</el-button>
                    </template>
                </el-form-item>
                <div style="height: 40px">
                  <el-button  @click="onCancel" style="float: right;" size="small">返回</el-button>
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
import {HOSTUPLOAD}from '../../config/config'
export default {
    components:{
       'imp-panel': panel
    },
    data(){
        return {
        HOSTUPLOAD:HOSTUPLOAD+'/UploadFiles/',
        detailsDatas: {
            name:'',
            typeName:'',
            startDate:null,
            endDate:null,
            typeId:null,
            creationTime:null,
            state:null,
            attachments:[]




        },
        formLabelWidth: '100px',
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
                    console.log(res.result);
                    if(!!res.result && res.success){
                      this.detailsDatas = res.result;
                      this.detailsDatas.startDate = this.dateFormat(res.result.startDate);
                      this.detailsDatas.endDate = this.dateFormat(res.result.endDate);
                      this.detailsDatas.creationTime = this.dateFormat(res.result.creationTime);
                    }
                    
                });
            },
            downLoad(item){
               var file = item.fileName.slice(0,8)
               window.open(this.HOSTUPLOAD+file+"/"+item.fileName)
            },
            dateFormat(value){                 
               return value.replace(/T/g, ' ').substring(0,19);                                           
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

