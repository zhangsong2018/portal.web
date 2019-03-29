<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;"  type="flex">
        <el-col :span="24">
           <el-input placeholder="员工姓名" v-model="form.StaffIds" style="width: 18%" class="margin-right-p2"  size="small">
           </el-input>
           <el-input placeholder="岗位ID" v-model="form.OrgId" style="width: 18%" class="margin-right-p2"  size="small">
              <el-button slot="append" @click="lookIDFn">查找</el-button>
           </el-input>
           <el-date-picker
             class="margin-right-p2"
              v-model="form.StartDate"
              type="date"
              placeholder="选择开始日期"  size="small" value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker
              class="margin-right-p2"
              v-model="form.EndDate"
              type="date"
              placeholder="选择结束日期"  size="small" value-format="yyyy-MM-dd">
            </el-date-picker>
             <template >
                <el-button type="primary" icon="el-icon-sreach" @click="seach"  size="small">搜索</el-button>
             </template>
      </el-col>


      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        border
        stripe
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"  :header-row-style="tableHeadStyle"  >
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column
          prop="positionName"
          label="岗位名称">
        </el-table-column>
         <el-table-column
          prop="userName"
          label="员工姓名">
        </el-table-column>
<!-- 
        <el-table-column
          prop="scheduleStartTimeHour"
          label="班次开始小时">
        </el-table-column>

        
        <el-table-column
          prop="scheduleStartTimeMinute"
          label="班次开始分钟">
        </el-table-column>

        
        <el-table-column
          prop="overTimeStartTimeHour"
          label="加班开始小时">
        </el-table-column>

        
        <el-table-column
          prop="overTimeStartTimeMinute"
          label="加班开始分钟">
        </el-table-column>

        
        <el-table-column
          prop="scheduleEndTimeHour"
          label="班次结束小时">
        </el-table-column>

        
        <el-table-column
          prop="scheduleEndTimeMinute"
          label="班次结束分钟">
        </el-table-column>


      <el-table-column
          prop="overTimeEndTimeHour"
          label="加班结束小时">
        </el-table-column>

        <el-table-column
          prop="overTimeEndTimeMinute"
          label="加班结束分钟">
        </el-table-column> -->


        <el-table-column
          prop="overTimeStartTime"
          label="加班开始时间">
        </el-table-column>
        <el-table-column
          prop="overTimeEndTime"
          label="加班结束时间">
        </el-table-column>
        <el-table-column
          prop="scheduleStartTime"
          label="班次开始时间">
        </el-table-column>
        <el-table-column
          prop="scheduleEndTime"
          label="班次结束时间">
        </el-table-column>
        <el-table-column
          prop="cardDate"
          label="加班日期">
        </el-table-column>

        <el-table-column
          prop="cardTime"
          label="加班打卡时间">
        </el-table-column>
        <el-table-column
          prop="overTimeTotalMinute"
          label="加班总分钟数">
        </el-table-column>
      </el-table>
    <template v-if="this.tableData.pagination.total>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page.sync="tableData.pagination.pageNo"
        :page-sizes="[5, 10, 20]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>
    </template>

         <el-dialog title="请选择" :visible.sync="dialogVisible" center :width="dWidth">
                <el-row  :gutter="24" style="margin-bottom: 20px;" v-loading="treeLoading">
                  <el-col  style="margin-bottom: 20px;width:300px">
                    <el-input v-model="search" size="small" style="margin-bottom:10px;"  placeholder="输入部门名称进行搜索">
                        <el-button slot="append" size="small">搜索</el-button>
                    </el-input>
                        <template v-if="roleTree">
                            <el-tree 
                                    :data="roleTree"
                                    ref="roleTree"
                                    highlight-current render-after-expand
                                    :expand-on-click-node="false" :default-expanded-keys="[1]"
                                    @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps" :filter-node-method="filterNode" 
                                    style="height:500px;overflow: auto;width:275px;border: 1px solid #ddd;border-radius: 4px;">
                            </el-tree>
                        </template>
                  
                  </el-col>
                  <template v-if="isSelectedOrgId">
                      <el-col  class="flot-left width-400">
                       <div class="grid-content line-height-p">
                         <span class=" fa fa-hourglass-end main-color"></span>
                         已经选<q class="main-color">{{isSelectedOrgName}}</q>,岗位ID为：<q class="main-color">{{isSelectedOrgId}}</q></div>
                    </el-col>
                  </template>
                  <template v-else>
                      <el-col  class="flot-left width-400">
                      <div class="grid-content nodatas fa fa-warning  line-height-p">未选中岗位ID，点击左侧树状图选中岗位ID</div>
                    </el-col>
                  </template>
                   
                </el-row>
                <el-row type="flex" justify="end">
                  <el-button  @click="cancelSelecedFn"  size="small">取 消</el-button> 
                  <el-button type="primary" @click="isSelectedFn"  size="small">确 定</el-button>
                </el-row>
          </el-dialog>
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import * as sysApi from '../../services/sys'
  import {setTableHeadStyle,contolAuth,timerFormat,stringFrontZore} from '../../utils/utils'
  import {headers,headerAppX,ROLESANDUSERS,pageSize,contactsList,contactsShowStyle} from "../../config/config"
  export default {
    components: {
      'imp-panel': panel,
      'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },
    data(){
      return {
        isSelectedOrgId:'',
        isSelectedOrgName:'',
        contolAuth:contolAuth(),
        currentRow: {},
        dWidth:'900px',
        tWidth:'600px',
        dialogVisible: false,
        dialogLoading: false,
        treeLoading:false,
        defaultProps:{
              children:'childOrgs',
              label:'chineseName',
            },
        roleTree: [],
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        form:{
          //开始时间
          StartDate:'',
          EndDate:'',
          StaffIds:'',
          OrgId:null,
        },
        titText:"",
        isActive:"",
        search:''

      }
    },
    methods: {

         isSeleAll(lists,totalCount){
            //是否全选
            
        },
        getCurrentRow(row){
         this.id = row.id;
         console.log(row)
        //  this.template = row.template;
        },
        cancelSelecedFn(){
          this.isSelectedOrgId="";
          this.dialogVisible = false;
          this.isSelectedOrgName = '';
        },
        isSelectedFn(){
          this.form.OrgId = this.isSelectedOrgId;
          this.isSelectedOrgName =  this.isSelectedOrgName;
          this.dialogVisible = false;
        },
        getPages(){
            let that = this;
            this.$nextTick(()=>{
                setTimeout(()=>{
                // console.log(this.form)
                    this.form.forEach((el,index)=>{
                        if(el.isGranted){
                            // console.log(this.$refs.multipleTable);
                            // console.log(this.form)
                            this.$refs.multipleTable.toggleRowSelection(this.form[index],true);
                        }
                    })
                },500)
            })
            
        },
        
      //文本搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.chineseName.indexOf(value) !== -1;
        },
        handleNodeClick(data){
            console.log(data.orgId)
            this.isSelectedOrgId = data.orgId;
             this.isSelectedOrgName = data.chineseName;
            this.data = data;
        },
        seach(){
          if(!!this.form.EndDate && !!this.form.StartDate){
              let sdate = new Date(this.form.StartDate).getTime();
              let edate = new Date(this.form.EndDate).getTime();
              if(sdate>edate){
                this.$message.error("结束日期不能小于开始日期");
                return false;
              }
          }
          if(this.form.OrgId===""){
            this.$message.error("岗位ID是必填内容");
            return false;
          }
          if(this.form.EndDate===""){
            this.$message.error("结束时间是必填内容");
            return false;
          }
          if(this.form.StartDate===""){
            this.$message.error("开始时间是必填内容");
            return false;
          }
          this.listLoading = true;
          this.$http.post(api.SYS_ATTENDANCE_OVERTIMELOG,this.form)
          .then(res => {
            console.log(res)
            if(!res){
                this.logOff()
                return false;
            }
            console.log(res.data.result.overTimeList);
            this.tableData.rows = res.data.result.overTimeList||[];
            //时间格式优化
            this.tableData.rows.forEach((item,index)=>{
              if(item.cardTime){
               item.cardTime =  timerFormat(item.cardTime)
              }
              if(item.cardDate){
                item.cardDate = item.cardDate.toString().slice(0,10)
              }
              //合并数据：加班开始时间overTimeStartTime，加班结束时间overTimeEndTime，班次开始时间scheduleStartTime，班次结束时间scheduleEndTime
              item.overTimeStartTime = stringFrontZore(item.overTimeStartTimeHour,':',item.overTimeStartTimeMinute)
              item.overTimeEndTime = stringFrontZore(item.overTimeEndTimeHour,':',item.overTimeEndTimeMinute)
              item.scheduleStartTime = stringFrontZore(item.scheduleStartTimeHour,':',item.scheduleStartTimeMinute)
              item.scheduleEndTime = stringFrontZore(item.scheduleEndTimeHour,':',item.scheduleEndTimeMinute)

              })
            this.tableData.pagination.total = res.data.result.total;
            this.listLoading = false;
          }).catch(()=>{
            this.listLoading = false;
          });
      },
      searchFn(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      lookIDFn(){
          this.form.OrgId = '';
          this.isSelectedOrgName =  '';
          this.isSelectedOrgId = '';
          this.dialogVisible = true;
          this.treeLoading = true;
          setTimeout(()=>{
            this.$nextTick(()=>{
                  this.loadingDatas()
                  this.treeLoading = false;
                  })
            },3000)
      },
      loadingDatas(){
        this.$http.post(api.SYS_INST_ANS_POWER_DIVCE,headers).then((res)=>{
            console.log(res)
            if(!res){
              this.logOff()
              return false;
            }
                this.roleTree = [];
                this.roleTree.push(...res.data.result.structList)

                console.log(this.roleTree)
          })
        },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.clearCurrentPages();
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.clearCurrentPages();
        this.loadData();
      },
      loadData(){
          //分页跳转
          let page = window.sessionStorage.getItem("paginationes");
          //设置是否记录当前分页信息
          if(page){
              var  getPages = JSON.parse(page)
              if(getPages){
                   var  myList = getPages.overtimeLog;
                   if(myList){
                    this.tableData.pagination.pageNo = myList.currentPage;
                    this.tableData.pagination.pageSize = myList.pageSize;
                   }
              }
            }
            this.listLoading = true;
          this.$http.post(api.SYS_ATTENDANCE_OVERTIMELOG,{

             skipCount:this.tableData.pagination.pageSize*(this.tableData.pagination.pageNo-1),
             maxResultCount:this.tableData.pagination.pageSize,
             ...this.form
          })
          .then(res => {
            console.log(res)
            if(!res){
                this.logOff()
                return false;
            }
            this.tableData.rows = res.data.result.overTimeList||[];
            //时间格式优化
            this.tableData.rows.forEach((item,index)=>{
              if(item.cardTime){
               item.cardTime =  timerFormat(item.cardTime)
              }
              if(item.cardDate){
                item.cardDate = item.cardDate.toString().slice(0,10)
              }
               //合并数据：加班开始时间overTimeStartTime，加班结束时间overTimeEndTime，班次开始时间scheduleStartTime，班次结束时间scheduleEndTime
              item.overTimeStartTime = stringFrontZore(item.overTimeStartTimeHour,':', item.overTimeStartTimeMinute)
              item.overTimeEndTime = stringFrontZore(item.overTimeEndTimeHour,':',item.overTimeEndTimeMinute)
              item.scheduleStartTime = stringFrontZore(item.scheduleStartTimeHour,':',item.scheduleStartTimeMinute)
              item.scheduleEndTime = stringFrontZore(item.scheduleEndTimeHour,':',item.scheduleEndTimeMinute)

              })
              this.listLoading = false;
            this.tableData.pagination.total = res.data.result.total;
          }).catch(()=>{
            this.listLoading = false;
          });
      },
      tableHeadStyle(){
        return setTableHeadStyle()
      },
      //记录当前分页的信息，
      recodesCurrentPages(){
        console.log("记录当前的页数：");
        let skipCount=this.tableData.pagination.pageSize*(this.tableData.pagination.pageNo-1);
        let maxResultCount=this.tableData.pagination.pageSize
        let obj = JSON.stringify({
              overtimeLog:{
                maxResultCount:maxResultCount,
                skipCount:skipCount,
                currentPage:this.tableData.pagination.pageNo,
                pageSize:maxResultCount
              }
            });
        //存入缓存
        window.sessionStorage.setItem("paginationes",obj);
      },
      clearCurrentPages(){
        //点击进入页面时候清除记录的页面信息缓存
          window.sessionStorage.removeItem("paginationes");
      }
    },
    created(){
      
    },
    watch: {
      search(val) {
        this.$refs.roleTree.filter(val);
      }
    },
  }
</script>
<style scoped>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .overflow-hidden{
      overflow: hidden;
  }
  .flex-end{
    display: flex;
    justify-content: flex-end;
  }
  .flot-left{
    float: left;
  } .width-400{
    width: 562px;
    height: 540px;
    text-align: center;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .line-height-p{
    position: relative;
    padding-top: 45%;
    padding-bottom: 50%;
  }
</style>

