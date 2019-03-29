<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <template v-if="contolAuth && (contolAuth['WorkBench.ReportType.Edit']||contolAuth['WorkBench.ReportType.Create'])">
      <el-button type="primary" icon="plus" @click="newAdd" size="small">新增</el-button>
      <el-button type="danger" icon="delete" @click="batchDelete"  size="small">删除</el-button>
       </template>
    </h3>
    <el-row slot="body" style="margin-bottom: 20px;" :gutter="24">
      <el-col :span="4" :xs="24" :sm="24" :md="4" :lg="4" style="margin-bottom: 20px;">
        <!-- <el-tree v-if="resourceTree"
                 ref="resourceTree"
                 :data="resourceTree"
                 show-checkbox
                 highlight-current
                 :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps"></el-tree> -->
                  <el-tree v-if="resourceTree"
                 ref="resourceTree"
                 :data="resourceTree"
                 :check-on-click-node="true"
                 highlight-current
                 :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="id" :props="defaultProps" class="my-rep-tree"></el-tree>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <el-card class="box-card">
          <div class="text item">
            <el-form :model="form" ref="form">
              <el-form-item label="父级" :label-width="formLabelWidth">
                <!--<el-input v-model="form.parentId" auto-complete="off"></el-input>-->
                <el-select-tree v-model="form.parentId" :treeData="resourceTree" :propNames="defaultProps" clearable
                placeholder="请选择父级" size="small" ref="getParentValue" :maxLength="maxLength">
                </el-select-tree>
              </el-form-item>
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off" class="input-width-50p" size="small" :maxLength="maxLength"></el-input>
              </el-form-item>
              <el-form-item label="关联指令" :label-width="formLabelWidth">
                <el-input v-model="form.reportWorkBench.template" auto-complete="off" 
                v-if="form.workBenchId>0" disabled class="input-width-50p" size="small" ></el-input>
                <el-input auto-complete="off" class="input-width-50p"
                v-if="form.workBenchId==0" disabled size="small" ></el-input>
                <template v-if="contolAuth &&  (contolAuth['WorkBench.ReportType.Edit']||contolAuth['WorkBench.ReportType.Create'])">

                <el-button type="primary" @click="onSubShow()" class="margin-left-10"  size="small">选择</el-button>
                <el-button type="success" @click="onDetilShow()" v-show="form.id && form.id!=0"  class="margin-left-10"  size="small">查看</el-button>
                <el-button type="" @click="cancelConnect"  v-show="form.workBenchId!=0"  class="margin-left-10"  size="small">取消关联</el-button>

                </template>
              </el-form-item>
              <el-form-item label="" :label-width="formLabelWidth">
                <template v-if="contolAuth && (contolAuth['WorkBench.ReportType.Edit']||contolAuth['WorkBench.ReportType.Create'])">
                <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'新增'"  size="small"></el-button>
                </template>

                 <!-- <template v-if="contolAuth && contolAuth['WorkBench.ReportType.Delete']">
                  <el-button type="danger" @click="deleteSelected" icon="delete" v-show="form.id && form.id!=0">删除
                  </el-button>
                 </template> -->

              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
       <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
         <!-- <el-col :span="10" :xs="10" :sm="12"  :md="10" :lg="10"> -->
        <el-dialog title="关联指令" :visible.sync="outerVisible" center>
          <el-table
            ref="multipleTable"
            :data="tableData.slice((page.currentPage - 1) * page.pagesize, page.currentPage * page.pagesize)"
            tooltip-effect="dark"
            border
            stripe
           
            @select="select"
            @selection-change="handleSelectionChange">
            <el-table-column
              label="单选"
              width="55">
              <template slot-scope="scope">
                  <el-radio :label="scope.row.id" v-model="radio" @change="getCurrentRow(scope.row)">{{null}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              width="120"
              prop="name"
              >              
            </el-table-column>
            <el-table-column
              label="模板名"
              width="120"
              prop="template"
              >              
            </el-table-column>
            <el-table-column
              prop="intent"
              label="意图名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="clientType"
              label="客户端类型" center
              show-overflow-tooltip>
              <template slot-scope="scope">
                  <span v-show='scope.row.clientType == 3'>全部</span>
                  <span v-show='scope.row.clientType == 2'>pc端</span>
                  <span v-show='scope.row.clientType == 1'>移动端</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:20px;display: flex;justify-content: space-between; ">
              <el-pagination      
                @current-change="current_change"
                background
                :current-page="page.currentPage"
                :page-size="page.pagesize"
                layout="total,prev, pager, next, jumper"
                :total="page.total"
               >
              </el-pagination>
              <el-button type="primary" @click="saveid()"  size="small">确定</el-button>
          </div> 
          </el-dialog>
       </el-col>  


       <el-dialog title="工作台详情" :visible.sync="outerDetail" center :append-to-body="true" class="my-detail-dia">
               <template v-if="showId" slot-scope="body">     
                 <!-- {{showId}}           -->
                 <!-- <my-detail :myId="showId" :goIstrue="false" style="height:500px;overflow:auto;"></my-detail> -->
                 <el-form  label-width="130px" v-if="formDetal">
                <el-form-item label="名称">
                    {{formDetal.name}}
                </el-form-item>
                <el-form-item label="区域">
                    {{formDetal.sectionName}}
                </el-form-item>
                <!-- <el-form-item label="英文名称">
                    {{formDetal.enName}}
                </el-form-item>
                 <el-form-item label="所属区域英文名">
                    {{formDetal.enSectionName}}
                </el-form-item>
                <el-form-item label="图标">
                       <img :src="formDetal.iconUrl"  class="icon-imgs-pre">
                  
                </el-form-item>
                <el-form-item label="排序号">
                    {{formDetal.orderIndex}}
                </el-form-item> -->
                <el-form-item label="公开显示">
                     <template v-if='formDetal.isDefault'>是</template>
                     <template v-else>
                         否
                     </template>
                </el-form-item>
                <el-form-item label="移动端跳转链接">
                     <el-input :value="formDetal.mobileUrl" size="small" disabled class="input-width-80p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.mobileUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                <!-- <el-form-item label="BCIS移动端跳转链接">
                    <el-input :value="formDetal.bCISMobileUrl"  size="small"  disabled class="input-width-80p">
                        
                     </el-input>
                </el-form-item>
                 <el-form-item label="MAC跳转链接">
                     <el-input :value="formDetal.macUrl"  size="small"  disabled class="input-width-80p">
                        
                     </el-input>
                </el-form-item>
                 <el-form-item label="WIN跳转链接">
                     <el-input :value="formDetal.winUrl"  size="small"  disabled class="input-width-80p">
                         
                     </el-input>
                </el-form-item> -->
                 <el-form-item label="是否启用">
                    <template v-if='formDetal.isActive'>是</template>
                     <template v-else>
                         否
                     </template>
                </el-form-item>
                 <el-form-item label="类型">
                    <template slot-scope="scope" v-if="formDetal.clientType===1">移动端</template>
                    <template slot-scope="scope" v-if="formDetal.clientType===2">pc端</template>
                    <template slot-scope="scope" v-if="formDetal.clientType===3">全部</template>
                </el-form-item>
                
                 <el-form-item label="意图名">
                   {{formDetal.intent}}
                </el-form-item>
                 <el-form-item label="模板名">
                  {{formDetal.template}}
                </el-form-item>
                 <el-form-item label="备注">
                  {{formDetal.memo}}
                </el-form-item>
          </el-form>
                </template>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="outerDetail = false"  size="small">确 定</el-button>
                </span>


       </el-dialog>
    </el-row>
  </imp-panel>
   
</template>
<script>

  import panel from "../../components/panel.vue"
  import selectTree from "../../components/selectTree.vue"
  import treeter from "../../components/treeter"
  import merge from 'element-ui/src/utils/merge';
  import * as sysApi from '../../services/sys'
  import * as api from "../../api"
  import {headers,maxLength,clientType,UploadFiles,uploadUrl,HOSTUPLOAD} from '../../config/config'
  import {stringIsNull,stringTrimeFn,getImgURL,contolAuth} from '../../utils/utils'

  // import detail from '../../components/detail'

  export default {
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
      // 'my-detail':detail
    },
    data(){
      return {
        maxLength:maxLength,
        contolAuth:contolAuth(),
        formLabelWidth: '100px',
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        radio:0,
        page:{
          total:10,//默认数据总数
          pagesize:5,//每页的数据条数
          currentPage:1,//默认开始页面
        },
        outerVisible: false,
        outerDetail:false,
        showId:null,
        formDetal:null,
        resourceTree: [],
        maxId:700000,
        form: {
          parentId: 0,
          name: '',  
          id:0,                       
          workBenchId:0,
          reportWorkBench:{template:""}
        },
        template:"",
        tableData: [],
        multipleSelection: [],
        id:"",
        treeSelectedId:null
      }
    },
    methods: {
      cancelConnect(){
        //取消关联

        this.$confirm(
          '确定取消关联指令?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
           this.form.workBenchId=0;
           //this.form.name=""; 
           this.$message.success("取消了关联");
        }).catch(()=>{
          this.$message.info("已取消")
        })
       

      },
      saveid(){
         this.outerVisible = false;
         this.form.workBenchId = this.id;
         this.form.reportWorkBench.template = this.template;
      },
      getCurrentRow(row){
         this.id = row.id;
         console.log(row)
         this.template = row.template;
      },
      current_change(currentPage){
        this.page.currentPage = currentPage;
      },
      onSubShow(){
         this.outerVisible = true;
         if(this.form.workBenchId){
            this.radio = this.form.workBenchId;
         }else{
            this.radio = "";
         }
         this.selectDialog();
      },
      selectDialog(){
          this.$http.post(this.url+'/api/services/app/WorkBench/WorkBenchQuery',{SkipCount:0,MaxResultCount:10000,IsCommand:1,IsActive:1,IsFilterReportRelation:1})
            .then(res => {
              this.tableData = res.data.result.workBenchList;
              this.page.total = res.data.result.total;
            }).catch(e => {              
               console.log(e)
               this.$message('服务器发生未知异常');
            })
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      select(val){
         if(val.length > 1){        
          val.shift();
        }else{
          this.multipleSelection = val;
        }
      },
      handleSelectionChange(val) {
        if(val.length > 1){        
          val.shift();
        }else{
          this.multipleSelection = val;
        }
        
      },
      newAdd(){
        this.form = {
          parentId: 0,
          name: '',
          id:0,      
          workBenchId:0,
          reportWorkBench:{template:""}
        };
      },      
      deleteSelected(){  //删除节点     
          this.$http.post(this.url+'/api/Report/FileReportTypeDelete',{id:this.form.id})
            .then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
            this.$message('操作成功');
            console.log(checkKeys);
            this.batchDeleteFromTree(this.resourceTree, checkKeys);
          })
      },
      batchDelete(){//删除节点
        // var checkKeys = this.$refs.resourceTree.getCheckedKeys();
        // console.log(checkKeys)
        // debugger
        var checkKeys = [this.treeSelectedId];
        if (checkKeys == null || checkKeys.length <= 0) {
          this.$message.warning('请选择要删除的资源');
          return;
        }

        if(checkKeys[0]==null){
          this.$message.warning('请选择要删除的资源');
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.url+'/api/Report/FileReportTypeDelete',{id:checkKeys[0]})
            .then(res => {
              if(!res){
                this.$message.warning('类型已关联报表，不能删除');
                return 
              }
              this.$message.success('操作成功');
              this.newAdd();         
              this.load();
            },err => {
              this.$message.warning('类型已关联报表，不能删除');
            }).catch(e => {
              this.$message.success('操作成功');
              this.batchDeleteFromTree(this.resourceTree, checkKeys);
          })
        }).catch((err)=>{
            this.$message.info('已取消');
        }); 


      },
      handleNodeClick(data,node,tree){
        console.log(data)
        this.form = merge({}, data); //修改
        if(data.reportWorkBench == null){
          this.form.reportWorkBench = {template:""};
        }
        //点击节点时选中被删除的项目的id;
        if(!!data.id){
          this.treeSelectedId = data.id;
        }
        //修复后数据


        console.log(node);
        console.log(tree);

        console.log(this.form);
      },
      onSubmit(){
        if(this.form.name.trim()==""){
          this.$message.error("请输入名称");
          return false;
        }


       if(this.$refs.getParentValue.selectedLabel.trim()===""){
         this.form.parentId=0;
       } 
        //debugger
        if(this.form.id === this.form.parentId && this.form.id !== 0){
          this.$message.error('不能选择自己为自己的父节点');
          return false;
        }
        if (this.form.id == 0) {
          this.$http.post(this.url+"/api/Report/FileReportTypeSave", this.form)
            .then(res => {
              if(!res){
                this.$message.error('修改失败请刷新重试');
                return false;
              }
              this.$message('操作成功');
              this.form.id = res.data.result.id;
              this.appendTreeNode(this.resourceTree, res.data.result);
              this.load();
            }).catch(e => {
            this.maxId += 1;
            this.$message('操作成功');
            this.form.id = this.maxId;
            var  data = {
              parentId: this.form.parentId,
              id:this.form.id, 
              name:this.form.name,              
              workBenchId:this.form.workBenchId,           
              children:[],
            }
            this.appendTreeNode(this.resourceTree, data);
            this.resourceTree.push({});
            this.resourceTree.pop();
          })
        } else {
          console.log('修改当前结点',this.form);
          if(this.form.workBenchId===0){
            this.form.reportWorkBench={template:""};
          }
          this.$http.post(this.url+"/api/services/app/Report/FileReportTypeSave", this.form)
            .then(res => {
              if(!res){
                this.$message.error('修改失败请刷新重试');
                return false;
              }
              this.$message('操作成功');
              this.updateTreeNode(this.resourceTree, res.data.result);
              this.load();
            }).catch(e=>{
            this.$message('操作成功');
            this.updateTreeNode(this.resourceTree, merge({},this.form));
          })
        } //添加节点


      },
      loadDatail(){
        console.log(this.showId)
                    this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                        Id:this.showId
                    },headers).then((res) => {
                    if(!res){
                    this.logOff()
                    return false;
                    }
                    if(res.data.success){
                        //图片路径处理
                        let url = res.data.result.workBenchList[0].iconUrl;
                        res.data.result.workBenchList[0].iconUrl = getImgURL(HOSTUPLOAD,UploadFiles,url);

                        this.formDetal = res.data.result.workBenchList[0];
                        console.log(this.formDetal)
                    }else{
                    this.$message.error(res.data.error);
                    }
                }).catch((err)=>{
                    console.log(err)
                })
      },
      onDetilShow(){
        if(this.form.reportWorkBench.template==""){
             this.$message('请先关联指令，才能查看指令详情');
             return;
        }
        // this.$router.push({
        //   path:'workAndDericetiveDetail',
        //   query:{
        //     id:this.form.workBenchId
        //   }
        // })
        this.outerDetail= true;
        console.log(this.form.workBenchId)
        this.showId = this.form.workBenchId;
        // this.goIstrue=!this.goIstrue;
        
        this.loadDatail();
        

      },
      load(){ //资源列表
        //
        sysApi.resourceList()
          .then(res=>{
            this.resourceTree = [];
            this.resourceTree.push(...res)
          })
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
    created(){
      this.load();
    }
  }
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .my-detail-dia{
    width: 1120px; 
    margin-left: -560px;
    left: 50%;
  }
  .my-detail-dia .el-form-item{
    margin-bottom: 0;
  }

</style>
<style>

</style>

