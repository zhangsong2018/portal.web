<template>
    <imp-panel :title="1>0?'工作台指令列表':''">
        <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;"  type="flex"  align="left" justify="space-between">
        <el-col :span="3">
          <router-link :to="{ path: 'workAndDerictiveAdd'}">
             <template  v-if="contolAuth && contolAuth['WorkBench.Command.Create']">
            <el-button type="primary" icon="el-icon-plus" size="small">创建</el-button>
             </template>

          </router-link>
        </el-col>
         <el-col :span="3"  class="margin-right-p2">
            <el-input v-model="form.name" placeholder="请输入中文名"  size="small"></el-input>
        </el-col>
        <el-col  :span="3"  class="margin-right-p2">
             <el-input v-model="form.intent" placeholder="请输入意图名"  size="small"></el-input>
        </el-col>
        <el-col :span="3" type="flex"  center   class="margin-right-p2">
            <!-- <span>公开显示</span> -->
            <!-- <el-checkbox v-model="form.isDefault"  size="small"></el-checkbox>  -->
            <el-select v-model="form.isDefault" placeholder="请选择" size="small">
              <el-option  size="small"
                v-for="item in defaultList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-col>


         <el-col :span="3"  type="flex"  center style="text-align:center" class="margin-right-p2">
             <!-- <span>是否启用</span> -->
             <!-- <el-checkbox v-model="form.isActive"  size="small"> </el-checkbox>  -->
             <el-select v-model="form.isActive" placeholder="请选择" size="small">
              <el-option  size="small"
                v-for="item in activeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-col>

        <el-col :span="3"  class="margin-right-p2">
            <el-select v-model="form.clientType"  size="small" placeholder="请选择客户端类型">
                <el-option
                v-for="item in clientTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-col>
         <el-col :span="3">
           <template  v-if="contolAuth && contolAuth['WorkBench.Command']">
                <el-button icon="el-icon-search"  type="primary" @click="search"  size="small">搜索</el-button>
           </template>
        </el-col>

      </el-row>
    </h3>
   
    <div slot="body">
      <template v-if="tableData.rows && tableData.rows.length>0">
      <!-- <el-table
        :data="tableData.rows.slice((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange" :stripe="true" :header-row-style="tableHeadStyle" > -->
        <el-table
        :data="tableData.rows" 
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange" :stripe="true" :header-row-style="tableHeadStyle" >
        <!-- <el-table-column
          prop="id"
          width="50" label="序号">
        </el-table-column> -->
         <!-- <el-table-column
          prop="orderIndex"
          label="排序号">
        </el-table-column> -->
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
         <!-- <el-table-column
          prop="enName"
          label="英文名称">
        </el-table-column> -->
        <el-table-column
          prop="sectionName"
          label="区域">
        </el-table-column>
        
        <!-- <el-table-column
          prop="enSectionName"
          label="所属区域英文名">
        </el-table-column> -->
         <el-table-column
         
          label="图标">
          <template  slot-scope="scope">
            <template v-if="!!scope.row.iconUrl">
              <img :src="scope.row.iconUrl" class="icon-imgs-pre">
            </template>
              
          </template>
        </el-table-column>
        
         <el-table-column
          prop="isDefault"
          label="公开显示">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.isDefault ?'是':'否' }}</span>
          </template>
        </el-table-column>
         <!-- <el-table-column
          prop="mobileUrl"
          label="移动端跳转链接">
        </el-table-column>
        <el-table-column
          prop="macUrl"
          label="MAC跳转链接">
        </el-table-column>
        <el-table-column
          prop="winUrl"
          label="WIN跳转链接">
        </el-table-column> -->
         <el-table-column
          label="是否启用">
           <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.isActive?'是':'否' }}</span>
          </template>
        </el-table-column>
         <el-table-column label="类型" >
          <template  slot-scope="scope">
             {{scope.row.clientType|getYype}}
          </template>
          <!-- <template slot-scope="scope" v-if="scope.row.clientType==1">移动端</template>
          <template slot-scope="scope" v-if="scope.row.clientType==2">pc端</template>
          <template slot-scope="scope" v-if="scope.row.clientType==3">全部</template> -->
        </el-table-column>
        <el-table-column
          label="意图名">
           <template slot-scope="scope">{{ scope.row.intent}}</template>
        </el-table-column>
        <el-table-column
          prop="template"
          label="模板名">
        </el-table-column>
        <!-- <el-table-column
          prop="memo"
          label="备注">
        </el-table-column> -->
        
        
        <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <template  v-if="contolAuth && contolAuth['WorkBench.Command']">
             <el-button
              size="small"
              @click="gotoDetail(scope.$index, scope.row)"  type="success"  title="详情">
              详情
            </el-button>
            </template>
            <template  v-if="contolAuth && contolAuth['WorkBench.Command.Edit']">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)" title="编辑">
              编辑
            </el-button>
            </template>
            <template  v-if="contolAuth && contolAuth['WorkBench.Command.Delete']">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)" title="删除">
              删除
            </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNo"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination> -->
      <template  v-if="contolAuth && contolAuth['WorkBench.Command']">
      <el-row type="flex"  justify="flex-end" style="margin-top:20px;" v-if="tableData.rows && tableData.rows.length>0">
         <el-col >
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="tableData.pagination.pageNo"
            :page-size="tableData.pagination.pageSize"
             layout="total, sizes, prev, pager, next, jumper"
             background
            :page-sizes="[5, 10, 20]"
            :total="tableData.pagination.total">
            </el-pagination>
         </el-col>
      </el-row>
      </template>


      </template>
    </div>


  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import {headers,maxLength,clientType,HOSTUPLOAD,pageSize,UploadFiles,activeList,defaultList,deleteTipsObj} from '../../config/config'
  import {stringIsNull,stringTrimeFn,setTableHeadStyle,getImgURL,contolAuth} from '../../utils/utils'
  //import $ from 'jquery'
export default {
    data(){
        return { 
          //权限
        contolAuth:contolAuth(),
        currentRow: {},
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            total: 1000,
            pageNo: 1,
            pageSize: pageSize.ten
          },
          rows: []
        },
        clientTypeList:clientType,
        activeList:activeList,
        defaultList:defaultList,
        form:{
            name:'',
            isDefault:null,
            isActive:null,
            clientType:0,
            intent:'',
            skipCount:0,
            maxResultCount:pageSize.ten
        },
        //isCurrentPage:false
        }
    },
    created(){
        this.loadingDatas();
    },
    filters:{
      getYype(val){
        if(val==1){
          return "移动端"
        }
        if(val==2){
          return "pc端"
        }
        if(val==3){
          return "全部"
        }
        return ""
      }
    },
    mounted(){
        
    },
    components:{

    },
    methods:{
     
      getManayTypes(type,typeName){
         //this.form.isDefault===true?1:(this.form.isDefault===null?null:0)
         console.log(type);
         let endVal = null;
         if(type===null){
           endVal = null
         }else if(type===true || type===1){
           endVal = 1
         }else if(type===false || type===0){
           endVal =0;
         }

         if(typeName === "isDefault"){
           this.form.isDefault = endVal;
         }
         if(typeName === "isActive"){
           this.form.isActive = endVal;
         }
         return endVal
      },
        loadingDatas(){
            let datas = this.form;
            //分页跳转
            let page = window.sessionStorage.getItem("paginationes");
            //设置是否记录当前分页地址
              
            if(page){
              var  getPages = JSON.parse(page)
              if(getPages){
                   var  myList = getPages.workAndDerictiveList;
                   if(myList){
                    this.form.skipCount = myList.skipCount;
                    this.form.maxResultCount = myList.maxResultCount;
                    this.tableData.pagination.pageNo = myList.currentPage;
                    this.tableData.pagination.pageSize = myList.pageSize;
                   }
              }
            }
                
            this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                Name:this.form.name,
                IsDefault:this.getManayTypes(this.form.isDefault,'isDefault'),
                IsActive:this.getManayTypes(this.form.isActive,'IsActive'),
                ClientType:this.form.clientType,
                Intent:this.form.intent,
                SkipCount:this.form.skipCount,
                MaxResultCount:this.form.maxResultCount
            }).then((res) => {
            if(!res){
              this.logOff()
              return false;
            }
            if(res.data.success){
              this.datasUploads(res)
            }else{
              this.$message.error(res.data.error);
            }
          }).catch((err)=>{
            console.log(err)
          })
        },
    //分页效果
    handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.gotopages();
        this.loadingDatas();
      },
    handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.gotopages();

        this.loadingDatas();
      },
    
    gotopages(){
        //点击切换页面时切换数据
        this.clearCurrentPages();
        this.form.maxResultCount = this.tableData.pagination.pageSize;
        this.form.skipCount = (this.tableData.pagination.pageNo-1) * this.tableData.pagination.pageSize
    },
    handleEdit(index, row){
        this.recodesCurrentPages();
        this.$router.push({path: 'workAndDerictiveAdd', query: {
            id:row.id
        }})
    },
    handleDelete(index, row){
        this.$confirm(deleteTipsObj.tips, deleteTipsObj.title,{
             confirmButtonText: deleteTipsObj.confrimBtnText,
             cancelButtonText: deleteTipsObj.cancelBtnText,
             type:'waring'
        }).then(() => {
         
         
         this.$http.post(api.SYS_WORK_BENCH_QUERY_DEL,{
              id:row.id
          },headers).then(res => {
          //  if(!res){
          //     this.logOff()
          //     return false;
          //   }
          this.loadingDatas();
          this.$message({
            type: 'success',
            message: deleteTipsObj.success
          });
          });
        // let headersAuto = window.localStorage.getItem('imp-sid');
        // let url = this.url;
        // let that = this;
        //   $.ajax({
        //     url:url+"/"+api.SYS_WORK_BENCH_QUERY_DEL,
        //     method:"post",
        //     dataType:"JSON",
        //     headers: {
        //       'Content-Type': 'application/json;charset=UTF-8',
        //       "Authorization":"Bearer "+headersAuto
        //   },
        //     data:JSON.stringify({
        //        id:row.id
        //     }),
        //     success:function(res){
        //       if(res.result){
        //         that.loadingDatas();
        //       }
        //     },error:function(res){
        //     let error =  res.responseJSON
        //       if(res.status===500){
        //         console.log(error)
        //         that.$message.error(error.error.message);
        //       }
        //       if(res.status===401){
        //           that.logOff()
        //           return false;
        //       }
        //     }
        //   })




          
        },error=>{
          console.log(error);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: deleteTipsObj.cancel
          });          
        });
    },
    //记录当前分页信息
    recodesCurrentPages(){
        console.log("记录当前的页数：");
        let obj = JSON.stringify({
              workAndDerictiveList:{
                maxResultCount:this.form.maxResultCount,
                skipCount:this.form.skipCount,
                currentPage:this.tableData.pagination.pageNo,
                pageSize:this.tableData.pagination.pageSize
              }
            });
        //存入缓存
        window.sessionStorage.setItem("paginationes",obj);
    },

    clearCurrentPages(){
      //点击进入页面时候清除记录的页面信息缓存
        window.sessionStorage.removeItem("paginationes");
    },
    gotoDetail(index,row){
      this.recodesCurrentPages();
      this.$router.push({
        path:'workAndDericetiveDetail',
        query:{
          id:row.id
        }
      })
    },
     handleSelectionChange(val){
       console.log(val)
      },
    search(){
        this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                Name:this.form.name,
                IsDefault:this.form.isDefault?1:(this.form.isDefault===null?null:0),
                IsActive:this.form.isActive?1:(this.form.isActive===null?null:0),
                ClientType:this.form.clientType,
                Intent:this.form.intent,
                MaxResultCount: pageSize.ten,
                SkipCount: 0
                },headers).then((res) => {
                    if(!res){
                      this.logOff()
                      return false;
                    }
                    if(res.data.success){

                      //this.tableData.rows = res.data.result.workBenchList;
                      this.datasUploads(res)
                    }else{
                      this.$message.error(res.data.error);
                    }
          }).catch((err)=>{
            console.log(err)
          })
    },
    tableHeadStyle(){
        return setTableHeadStyle()
      },
    datasUploads(res){
        this.tableData.rows = res.data.result.workBenchList;
        this.tableData.pagination.total = res.data.result.total;
        this.tableData.rows.forEach((el,index)=>{
            if(el.iconUrl){
                let filesName = el.iconUrl;
                el.iconUrl =  getImgURL(HOSTUPLOAD,UploadFiles,filesName);
            }
        })
    }
  }  
}
</script>
<style scoped>
.el-pagination{
  display: flex;
    justify-content: flex-end;
}
.icon-imgs-pre{
  width: 30px;
}
</style>


