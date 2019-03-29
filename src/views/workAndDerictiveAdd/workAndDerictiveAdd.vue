<template>
  <imp-panel :title="form.id ? '编辑工作台指令':'创建工作台指令'">

    <el-form  label-width="180px">
    
      <el-form-item label="名称">
        <el-input v-model="form.name" :maxlength="maxlength" placeholder="请输入名称" class="input-width-50p"></el-input>
      </el-form-item>
      <el-form-item label="区域">
         <el-input v-model="form.sectionName" :maxlength="maxlength" placeholder="请输入区域" class="input-width-50p"></el-input>
      </el-form-item>
      <el-form-item label="英文名称">
        <el-input v-model="form.enName" :maxlength="maxlength" placeholder="请输入英文名称" class="input-width-50p"></el-input>
      </el-form-item>

       <el-form-item label="所属区域英文名">
         <el-input v-model="form.enSectionName" :maxlength="maxlength" placeholder="请输入所属区域英文名" class="input-width-50p"></el-input>
       </el-form-item>
        <el-form-item  label="图标">
             <!-- <el-upload
            class="upload"
            :action="uploadUrl"
            :before-upload="beforeupload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture" :multiple="true"   :data=uploadsDatas>
            <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> -->
            <el-upload
              class="upload upload-icon"
              :multiple="false"   :limit='1'
              :action="uploadUrl"
              :before-upload="beforeupload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="fileList"
              list-type="picture"  :on-success="uploadSuccess" :on-exceed="handleMaxLengthFiles">
              <template  v-if="contolAuth && (contolAuth['WorkBench.Command.Edit']||contolAuth['WorkBench.Command.Create'])">
              <el-button size="small" type="success">点击上传</el-button>
              </template>
              <div slot="tip" class="el-upload__tip">只能上传一张图片,格式是jpg/jpeg/png文件，且不超过20M</div>
            </el-upload>
            
         </el-form-item>
      <el-form-item label="排序号">
        <el-input v-model="form.orderIndex" :maxlength="maxlength" type=number placeholder="请输入排序号" class="input-width-50p" min="0"></el-input>
      </el-form-item>

      <el-form-item label="是否可以所有人用">
         <template>
              <el-radio v-model="form.isDefault" :label='1'>是</el-radio>
              <el-radio v-model="form.isDefault" :label='0'>否</el-radio>
          </template>
      </el-form-item>
      <div class="line margin-bottom-25" title="分割线"></div>

      <el-form-item label="移动端跳转链接">
        <el-input v-model="form.mobileUrl" :maxlength="maxLengthUrl"  placeholder="请输入移动端跳转链接" class="input-width-50p"></el-input>
      </el-form-item>

      <el-form-item label="BCIS移动端跳转链接">
        
        <el-input v-model="form.bcisMobileUrl" :maxlength="maxLengthUrl"  placeholder="请输入BCIS移动端跳转链接" class="input-width-50p"></el-input>
      </el-form-item>

       <el-form-item label="MAC跳转链接">
        <el-input v-model="form.macUrl" :maxlength="maxLengthUrl"  placeholder="请输入MAC跳转链接" class="input-width-50p"></el-input>
      </el-form-item>

      <el-form-item label="WIN跳转链接">
        <el-input v-model="form.winUrl" :maxlength="maxLengthUrl"   placeholder="请输入WIN跳转链接" class="input-width-50p"></el-input>
      </el-form-item>

       <el-form-item label="是否启用">
          <template>
              <el-radio v-model="form.isActive" :label='1'>是</el-radio>
              <el-radio v-model="form.isActive" :label='0'>否</el-radio>
          </template>
        </el-form-item>
         <el-form-item label="客户端类型">
          <template>
              <el-select v-model="form.clientType" placeholder="请选择客户端类型">
                <el-option
                v-for="item in clientTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          </template>
        </el-form-item>

    <el-form-item label="意图名">
        <el-input v-model="form.intent" :maxlength="maxlength"   placeholder="请输入意图名" class="input-width-50p"></el-input>
      </el-form-item>

      <el-form-item label="模板名">
        <el-input v-model="form.template" :maxlength="maxlength"  placeholder="请输入模板名" class="input-width-50p"></el-input>
      </el-form-item>
         <el-form-item label="备注">
        <el-input   type="textarea" v-model="form.memo" :maxlength="maxLengthUrl"   placeholder="请输入备注，500字以内" class="input-width-50p"></el-input>
      </el-form-item>
      
      <el-form-item>
        <template  v-if="contolAuth && contolAuth['WorkBench.Command.Edit']">
        <el-button type="primary" @click="onEditSubmit" v-if="form.id"  size="small" >保存</el-button>
         <el-button  @click="onCancel"  size="small" v-if="form.id" >取消</el-button>
        </template>
         <template  v-if="contolAuth && contolAuth['WorkBench.Command.Create']">
         <el-button type="primary" @click="onSubmit" v-if="!form.id" size="small" >保存</el-button>
        <el-button  @click="onCancel"  v-if="!form.id"  size="small" >取消</el-button>
         </template>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import {
  headers,
  maxLength,
  maxLengthUrl,
  clientType,
  uploadUrl,
  UploadFiles,
  isLt20M,
  limitFilesType,
  limitFilesTypeText,
  HOSTUPLOAD,
  limitImgTypeText
  } from '../../config/config'
  import {stringIsNull,stringTrimeFn,getImgURL,contolAuth} from '../../utils/utils'
  import myUpload from 'vue-image-crop-upload';
  console.log(headers)
  export default {
    components: {
        'imp-panel': panel,
		    'my-upload': myUpload
		},
    data(){
      return {
        contolAuth:contolAuth(),
        uploadUrl:uploadUrl,
        // uploadsHeaders:{
        //   "content-type":"application/json"
        // },
         uploadsHeaders:{
          "content-type":""
        },
        
        maxlength:maxLength,
        maxLengthUrl:maxLengthUrl,
        clientTypeList:clientType,
        headers:{
          //"content-type":"application/x-www-form-urlencoded",
          headers:{
            "content-type":"multipart/form-data"
            //"content-type":"application/x-www-form-urlencoded"
            
          }
          
          //"content-type":"application/json"
        },
        show: false,
        fileList:[],
        files:{
          files:[]
        },
         fileReader: '',
        newHeaders: {
            'Content-Type': undefined
        },
        uploadsDatas:{},
        imgDataUrl: '',
        form:{
          name:"",
          enName:"",
          sectionName:"",
          enSectionName:"",
          iconUrl:"",
          orderIndex:null,
          isDefault:0,
          mobileUrl:"",
          bcisMobileUrl:"",
          macUrl:"",
          winUrl:"",
          isActive:0,
          clientType:3,
          intent:"",
          template:"",
          memo:""
        }
      }
    },
    created(){
      
      this.loadData();
    },
    mounted(){
        if (!window.FileReader) {
          console.error('Your browser does not support FileReader API!')
        }
        this.fileReader = new FileReader()
    },
    methods: {
       
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        
      },
    uploadSuccess(file){
      console.log(file)
      if(file){
         //this.form.iconUrl = file.result.fileNames[0];
         this.form.iconUrl = getImgURL(HOSTUPLOAD,UploadFiles,file.result.fileNames[0])
         this.$message.success('上传成功！');
      }
    },
      onSubmit(){
       if(this.form.clientType===null){
           this.$message.error('客户端类型为必选项');
           return false
       }

       if(this.form.isDefault===null){
           this.$message.error('是否可以所有人用为必选项');
           return false;
       }
        this.commSubmitFn();
      },
      onEditSubmit(){
         if(this.form.clientType===null){
           this.$message.error('客户端类型为必选项');
           return false
       }

       if(this.form.isDefault===null){
           this.$message.error('是否可以所有人用为必选项');
           return false;
       }
         this.commSubmitFn();
      },
      onCancel(){
          //console.log('取消')
          this.$confirm('您确定取消吗？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(()=>{
                    this.$router.push({path: 'workAndDerictiveList'})
                }).catch((err)=>{
                    console.log(err)
                })
          
      },
      handleMaxLengthFiles(files, fileList){
        
        if(fileList[0].status=="success"){
            this.$message.warning('最多可以上传一张图片');
        }else{
            this.$message.error('发生了错误');
        }
      },
      beforeupload(file,id){
       var imgtype=file.name.substring(file.name.lastIndexOf('.')+1);

			const extension = imgtype === limitFilesType.png;
      const extension2 = imgtype === limitFilesType.jpg;
      const extension3 = imgtype === limitFilesType.jpeg;

      const isLt10 = file.size / 1024 / 1024 < isLt20M;
       if(!isLt10){
         this.$message.warning('图片文件不能大于20M');
         return false;
       }

       if(!extension&&!extension2&&!extension3){
          this.$message.warning('请上传'+limitImgTypeText)+'图片类型';
          return false;
       }
       //debugger
    },
    handleChange(file){
      console.log(file)
      //debugger
    },
      loadData(){
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
            this.form.id = this.$route.query.id;
            this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                Id:this.form.id
            },headers).then((res) => {
             if(!res){
              this.logOff()
              return false;
            }
            if(res.data.success){
              res.data.result.workBenchList[0].isActive = res.data.result.workBenchList[0].isActive?1:0;
              res.data.result.workBenchList[0].isDefault = res.data.result.workBenchList[0].isDefault?1:0;
              res.data.result.workBenchList[0].isGranted = res.data.result.workBenchList[0].isGranted?1:0;
              let url = res.data.result.workBenchList[0].iconUrl

              //res.data.result.workBenchList[0].iconUrl = getImgURL(HOSTUPLOAD,UploadFiles,url);
              console.log(res.data.result.workBenchList[0].iconUrl)
              //debugger
              this.fileList=[{name: '图片', url: res.data.result.workBenchList[0].iconUrl}];

              //http://jujia01.ycsenior.com:5007/UploadFiles/图片名前八位/图片名
              console.log(res.data.result.workBenchList[0])
               this.form = res.data.result.workBenchList[0];
            }else{
              this.$message.error(res.data.error);
            }
          }).catch((err)=>{
            console.log(err)
          })
        }
      },
      //编辑和新增的公用函数
      commSubmitFn(){
        //this.form
        console.log(11)
        if(this.form.orderIndex){
          this.form.orderIndex = parseInt(this.form.orderIndex);
        }

        if(this.form.clientType){
           this.form.clientType = parseInt(this.form.clientType);
        }
        
        if(this.form.id){
           this.form.id = parseInt(this.form.id);
        }
        if(this.form.orderIndex===null){
          delete this.form.orderIndex
        }
        if(this.form.isActive===null){
          delete this.form.isActive
        }



    //中文正则匹配
    //let chinese = /^[/u4e00-/u9fa5]{0,}$/;
    //let chinese = '';

    //英文正则匹配
    //let english  = /^[a-zA-Z]+$/;
    //let english  = '';
//         1.Name中文名称，EnName英文名称，
//         SectionName中文所属区域，
//         EnSectionName英文所属区域，
//         ICONURL图标，这几项，只要填了1项，其他项都必须要填。
//        2.Intent 意图名
//        ----------------
//        1和2是或的关系，填了1不用 填2，填了2不用填1,1和2都填是允许的。
      if(!this.form.intent){
        if(!this.form.name && this.form.sectionName && this.form.enSectionName && this.form.ICONURL){
            //debugger
        }else{
          if(!this.valiterFn()&& typeof this.valiterFn()!=="undefined"){
            return false;
          }
          //debugger
          //this.valiterFn()
        }
        
      }else{
        //debugger
      }
      //保存时对图片做处理还原成只包含图片名称
      //debugger
      //兼容老数据，如果没有带前缀则编辑时追加前缀
      if(this.form.iconUrl && this.form.iconUrl!="" && this.form.iconUrl.indexOf("http")==-1 && this.form.iconUrl.length>0){
              this.form.iconUrl = getImgURL(HOSTUPLOAD,UploadFiles,this.form.iconUrl);
      }

        this.$http.post(api.SYS_WORK_BENCH_QUERY_ADD_EDIT,this.form, headers).then((res) => {
            if(!res){
              this.$message.error("添加失败！");
              return false;
            }
             if(!res){
              this.logOff()
              return false;
            }
            if(res.data.success){

            // this.$confirm('添加成功, 是否返回列表?', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'success'
            // }).then(() => {
              
            // })
            this.$message.success("添加成功！");
            this.$router.push({path: 'workAndDerictiveList'})
            }else{
              this.$message.error("添加失败！");
            }
          }).catch((err)=>{
            console.log(err)
          })
      },
      valiterFn(){

        if(this.form.name!==''){
          if(this.form.sectionName===''){
            this.$message.error('中文所属区域不能为空！');
            return false;
          }
          // if(!chinese.test(this.form.name)){
          //   this.$message.error('名称必须是中文！');
          //   return false;
          // }
          if(this.form.enSectionName===''){
            this.$message.error('英文所属区域不能为空！');
            return false;
          }
          if(this.form.enName===''){
            this.$message.error('英文名称不能为空！');
            return false;
          }
          // if(!english.test(this.form.enName)){
          //   this.$message.error('名称必须是英文！');
          //   return false;
          // }
          if(this.form.ICONURL===''){
            this.$message.error('图标不能为空！');
            return false;
          }
      }

      if(this.form.sectionName!==''){
        if(this.form.name===''){
          this.$message.error('名称不能为空！');
          return false;
        }
        // if(!chinese.test(this.form.name)){
        //   this.$message.error('名称必须是中文！');
        //   return false;
        // }
        if(this.form.enName===''){
           this.$message.error('英文名称不能为空！');
          return false;
        }
        // if(!english.test(this.form.enName)){
        //   this.$message.error('名称必须是英文！');
        //   return false;
        // }
        if(this.form.enSectionName===''){
          this.$message.error('英文所属区域不能为空！');
          return false;
        }
        if(this.form.ICONURL===''){
          this.$message.error('图标不能为空！');
          return false;
        }
        
      }

      if(this.form.enSectionName!==''){
        if(this.form.name===''){
          this.$message.error('名称不能为空！');
          return false;
        }
        //  if(!chinese.test(this.form.name)){
        //   this.$message.error('名称必须是中文！');
        //   return false;
        // }
        if(this.form.enName===''){
           this.$message.error('英文名称不能为空！');
          return false;
        }
        // if(!english.test(this.form.enName)){
        //   this.$message.error('名称必须是英文！');
        //   return false;
        // }
        if(this.form.sectionName===''){
          this.$message.error('区域不能为空！');
          return false;
        }
        if(this.form.ICONURL===''){
          this.$message.error('图标不能为空！');
          return false;
        }
      }

      if(this.form.ICONURL!==''){
        if(this.form.name===''){
          this.$message.error('名称不能为空！');
          return false;
        }
        //  if(!chinese.test(this.form.name)){
        //   this.$message.error('名称必须是中文！');
        //   return false;
        // }
        if(this.form.enName===''){
           this.$message.error('英文名称不能为空！');
          return false;
        }
        // if(!english.test(this.form.enName)){
        //   this.$message.error('名称必须是英文！');
        //   return false;
        // }
        if(this.form.sectionName===''){
          this.$message.error('区域不能为空！');
          return false;
        }
        if(this.form.enSectionName===''){
          this.$message.error('英文所属区域不能为空！');
          return false;
        }
      }


      if(!this.form.enName===''){
          if(this.form.name===''){
            this.$message.error('名称不能为空！');
            return false;
          }
          //  if(!chinese.test(this.form.name)){
          //   this.$message.error('名称必须是中文！');
          //   return false;
          // }
          // if(!english.test(this.form.enName)){
          //   this.$message.error('名称必须是英文！');
          //   return false;
          // }
          if(this.form.sectionName===''){
            this.$message.error('区域不能为空！');
            return false;
          }
          if(this.form.enSectionName===''){
            this.$message.error('英文所属区域不能为空！');
            return false;
          }
          if(this.form.ICONURL===''){
            this.$message.error('图标不能为空！');
            return false;
          }
        }

        //debugger
        return true
      }
    }
  }
</script>
<style>
.upload-icon .el-upload-list.el-upload-list--picture{
  width: 50%;
}

</style>


