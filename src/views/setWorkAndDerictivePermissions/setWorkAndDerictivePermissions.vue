<template>
    <imp-panel :title="1>0?'工作台权限':'工作台权限'">
    <div slot="body">
      <template v-if="tableData.rows.length>0">
      <!-- <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"> -->
         <el-table ref="multipleTable"
        :data="tableData.rows.slice((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)"  :header-row-style="tableHeadStyle"  height="700"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange" id="ec_table" :stripe="true" :row-key="getRowKeys">
        <!--element-ui表格选中态分页效果-start-->
        <!-- 1、 :data=tableData.rows.slice((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)
        2、:row-key="getRowKeys"绑定的唯一key
        3、在被绑定选中状态上设置:reserve-selection="true"
        4、 @selection-change="handleSelectionChange" 返回选中的数组序列
        5、初始化：便利数据初始化this.$refs.multipleTable.toggleRowSelection(this.tableData.rows[index],true); -->
        <!--element-ui表格选中态分页效果-end-->
       
        <el-table-column
          prop="isGranted"
          width="50" label="序号"  type="selection" :reserve-selection="true">
          <!-- <template>
              <el-input type="checkbox" slot-scope="scope" v-model="scope.row.isGranted"></el-input>
          </template> -->
        </el-table-column>
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
              <img :src="scope.row.iconUrl"  class="icon-imgs-pre">
          </template>
        </el-table-column>
        
         <el-table-column
          prop="isDefault"
          label="公开显示">
        </el-table-column>
         <!-- <el-table-column
          prop="mobileUrl"
          label="移动端跳转链接">
        </el-table-column> -->
        <!-- <el-table-column
          prop="macUrl"
          label="MAC跳转链接">
        </el-table-column> -->
        <!-- <el-table-column
          prop="winUrl"
          label="WIN跳转链接">
        </el-table-column> -->
         <el-table-column
          prop="isActive"
          label="是否启用">
        </el-table-column>
         <el-table-column
          
          label="类型" prop="clientType">
         
          
          <!-- <template slot-scope="scope" v-if="scope.row.clientType===1">移动端</template>
          <template slot-scope="scope" v-if="scope.row.clientType===2">pc端</template>
          <template slot-scope="scope" v-if="scope.row.clientType===3">全部</template> -->
        </el-table-column>
        <el-table-column
          prop="intent"
          label="意图名">
        </el-table-column>
        <el-table-column
          prop="template"
          label="模板名">
        </el-table-column>
        <!-- <el-table-column
          prop="memo"
          label="备注">
        </el-table-column> -->
        
        
        <!-- <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
             <el-button
              size="small"
              type="success"
              icon="el-icon-info"
              @click="gotoDetail(scope.$index, scope.row)"  title="详情">
            </el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)" title="编辑">
            </el-button>
            <el-button
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)" title="删除">
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-row type="flex"  justify="center" style="margin-top:20px;">

          <el-col  style="margin-top:20px;display: flex;justify-content: space-between; ">
              <div> 

                <template v-if="contolAuth && contolAuth['WorkBench.Command']">
                  <el-button type="primary" size='small' @click="submitDatas()">保存</el-button>
                  <el-button  size='small' @click="cancelSubmit()">取消</el-button>
                </template>
              
              </div>
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
    </div>


  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import {headers,maxLength,clientType,HOSTUPLOAD,pageSize,UploadFiles} from '../../config/config'
  import {stringIsNull,stringTrimeFn,setTableHeadStyle,getImgURL,contolAuth} from '../../utils/utils'
  import Vue from 'vue'
  
    
  
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
            total: 1,
            pageNo: 1,
            pageSize: pageSize.ten
          },
          rows: []
        },
        clientTypeList:clientType,
        WorkBenchIds:[],
        form:{
            name:'',
            isDefault:0,
            isActive:1,
            clientType:'',
            intent:''
        }
        }
    },
    created(){
    },
    mounted(){
        this.loadingDatas();
        this.$nextTick(()=>{
             let that = this;
            setTimeout(()=>{
                   this.tableData.rows.forEach((el,index)=>{
                    if(el.isGranted){
                        console.log(el.isGranted)
                        this.$refs.multipleTable.toggleRowSelection(this.tableData.rows[index],true);
                    }
                    if(el.iconUrl){
                        let filesName = el.iconUrl;
                        //http://jujia01.ycsenior.com:5007/UploadFiles/图片名前八位/图片名
                        el.iconUrl =  getImgURL(HOSTUPLOAD,UploadFiles,filesName);  
                        
                        
                    }

                    if(el.clientType){
                      el.clientType = this.setClitenType(el.clientType)
                    }else{
                      el.clientType = "";
                    }
                })
            },300)
        })
    },
    components:{
    },
    methods:{
      setClitenType(val){
        if(val===1){
          return "移动端"
        }
        if(val===3){
          return "全部"
        }
        if(val===2){
          return "pc端"
        }
        return ""
      },
        getRowKeys(row) {
            console.log(row)
                return row.id;
        },
        loadingDatas(){
            let datas = this.form
            if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
                this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                    RoleId:this.$route.query.id,
                    // isDefault:false,
                    // isActive:true,
                    //ClientType: 0,
                    isDefault:0,
                    isActive:1,
                    MaxResultCount: 10000,
                    SkipCount: 0

                },headers).then((res) => {
                if(!res){
                  this.logOff()
                  return false;
                }
                if(res.data.success){
                    res.data.result.workBenchList.forEach((el,index)=>{
                      el.isDefault = el.isDefault? '是':'否'
                      el.isActive = el.isActive? '是':'否'
                    })
                    this.tableData.rows = res.data.result.workBenchList;
                    //前端分页
                    this.tableData.pagination.total = this.tableData.rows.length
                }else{
                this.$message.error(res.data.error);
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
        },
    //分页效果
    handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        console.log('改变尺寸',val);
      },
    handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        console.log('当前',val);
      },

    handleEdit(index, row){
        this.$router.push({path: 'workAndDerictiveAdd', query: {
            id:row.id
        }})
    },
    handleDelete(index, row){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示',{
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type:'waring'
        }).then(() => {
          this.$http.post(api.SYS_WORK_BENCH_QUERY_DEL,{
              id:row.id
          },headers).then(res => {
          if(!res){
              this.logOff()
              return false;
          }
          this.loadingDatas();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    gotoDetail(index,row){
      this.$router.push({
        path:'workAndDericetiveDetail',
        query:{
          id:row.id
        }
      })
    },
    handleSelectionChange(val){
        console.log(val)
        let arr = [];
           val.forEach((el,index)=>{
            arr.push(el.id);
          })
       this.WorkBenchIds = arr;
    },
    submitDatas(){
         if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
                this.form.id = this.$route.query.id;
                this.$http.post(api.SYS_WORK_AND_DERICCTIVE_PERMISSIONS,{
                    RoleId: this.form.id,
                    WorkBenchIds:this.WorkBenchIds
                },headers).then((res)=>{
                 console.log(res);
                  if(!res){
                    this.logOff()
                    return false;
                  }
                 if(res.data.success){
                     //this.$message.success('设置成功');
                        //  this.$confirm('修改成功, 是否返回列表?', '提示', {
                        //     confirmButtonText: '确定',
                        //     cancelButtonText: '取消',
                        //     type: 'success'
                        //     }).then(() => {
                        //     this.$router.push({path: 'roleList'})
                        // }).catch((err) => {
                        //     console.log(err);
                            
                        // }); 
                        this.$router.push({path: 'roleList'})
                        this.$message.success('保存成功');
                 }else{
                     this.$message.success(res.data.error);
                 }
             }).catch((err)=>{
                 console.log(err);
             })
            }
        
    },
    cancelSubmit(){
        this.$confirm('您确定取消吗？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(()=>{
                     this.loadingDatas();
                    this.$router.push({path: 'roleList'})
                }).catch((err)=>{
                    console.log(err)
                })
    },
     tableHeadStyle(){
        return setTableHeadStyle()
      }
    }
}
</script>
<style>

</style>


