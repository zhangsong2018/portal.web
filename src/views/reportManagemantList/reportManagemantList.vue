<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;"  type="flex">
        <el-col :span="4">
          <router-link :to="{ path: 'reportManagemantAdd'}">
            <template v-if="contolAuth && contolAuth['WorkBench.Report.Create']">
            <el-button type="primary"  icon="el-icon-plus" size="small">新增</el-button>
            </template>
          </router-link>
        </el-col>
        <el-col :span="20" justify="end" class="overflow-hidden flex-end">
           <el-input placeholder="按类型查询" v-model="from.typeName" style="width: 18%" class="margin-right-p2"  size="small">
           </el-input>
           <el-date-picker
             class="margin-right-p2"
              v-model="from.startDate"
              type="datetime"
              placeholder="选择开始日期时间"  size="small">
            </el-date-picker>
            <el-date-picker
              class="margin-right-p2"
              v-model="from.endDate"
              type="datetime"
              placeholder="选择结束日期时间"  size="small">
            </el-date-picker>
             <template v-if="contolAuth && contolAuth['WorkBench.Report']">
                <el-button type="primary" icon="el-icon-sreach" @click="seach()"  size="small">搜索</el-button>
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
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="开始时间"
          :formatter="dateFormat"
          >
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="结束时间"
          :formatter="dateFormat"
          >
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="报表类型"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          >
          <template slot-scope="scope">
            {{ scope.row.state===1 ? '已审核' : '待审核' }}
          </template>
        </el-table-column>
        <el-table-column
          label="是否开启"
          >
          <template slot-scope="scope">
            {{ scope.row.isActive===true ? '已激活' : '未激活' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" fixed="right">
          <template slot-scope="scope">

            <template   v-if="contolAuth && contolAuth['WorkBench.Report.Approval']">
             
              <el-button
                size="small"
                type="warning"
                v-if="!scope.row.isActive"
                @click="handleRoleConfig(scope.$index, scope.row)"  title="审核">审核
              </el-button>
              <el-button
                size="small"
                type="warning"
                v-if="scope.row.isActive"
                disabled
                @click="handleRoleConfig(scope.$index, scope.row)"  title="审核">审核
              </el-button>
            </template>

             <template v-if="contolAuth && contolAuth['WorkBench.Report.IsActive']">
            <el-switch
              on-color="#00A854"
              on-text="启动"
              on-value="1"
              off-text="禁止"
              off-value="0"
              v-model="scope.row.isActive"
              v-if="scope.row.state != 0"
              @change="correlationFn(scope.row)"  title="是否激活"
             class="margin-left-10 margin-right-10">
            </el-switch>
            <el-switch
              v-model="scope.row.isActive"
              v-if="scope.row.state == 0"
              disabled  title="是否激活" class="margin-left-10 margin-right-10">
            </el-switch>
             </template>
             
            <el-button
              size="small"
              icon="el-icon-detail"
              @click="handleDetail(scope.$index, scope.row)" type="success"  title="详情">详情
            </el-button>

             
            <template v-if="contolAuth && contolAuth['WorkBench.Report.Edit']">
            <el-button
              size="small"
              type="default"
              v-if="scope.row.state == 0"
              @click="handleEdit(scope.$index, scope.row)"  title="编辑">编辑
            </el-button>
            <el-button
              size="small"
              type="default"
              v-if="scope.row.state != 0"
              disabled
              @click="handleEdit(scope.$index, scope.row)" title="编辑">编辑
            </el-button>
            </template>

            <template v-if="contolAuth && contolAuth['WorkBench.Report.Delete']">
              <template v-if="scope.row.isActive">
                <el-button
                size="small"
                @click="handleDelete(scope.$index, scope.row)"  disabled  type="danger" title="删除">删除
                </el-button>
              </template>
              <template v-if="!scope.row.isActive">
                <el-button
                size="small"
                @click="handleDelete(scope.$index, scope.row)" type="danger" title="删除">删除
                </el-button>
              </template>
              
            </template>

          </template>
        </el-table-column>
      </el-table>

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

      <el-dialog title="配置用户角色" v-model="dialogVisible" size="tiny">
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              ref="roleTree"
              :data="roleTree"
              show-checkbox
              check-strictly
              node-key="id" v-loading="dialogLoading"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configUserRoles">确 定</el-button>

          </span>
      </el-dialog>
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  //import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'
  import {setTableHeadStyle,contolAuth} from '../../utils/utils'
  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        contolAuth:contolAuth(),
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            total: 1000,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        from:{
            //按类型搜索
          typeName:'',
          //开始时间
          startDate:'',
          endDate:'',
        },
        titText:"",
        isActive:"",
      }
    },
    methods: {
      seach(){
          if(!!this.from.endDate && !!this.from.startDate){
              let sdate = new Date(this.from.startDate).getTime();
              let edate = new Date(this.from.endDate).getTime();
              if(sdate>edate){
                this.$message.error("结束日期不能小于开始日期");
                return false;
              }
          }

          sysApi.userList(this.from)
          .then(res => {
            console.log(res)
            if(!res){
                this.logOff()
                return false;
            }
            this.tableData.rows = res.result.fileReportList;
            this.tableData.pagination.total = res.result.total;
          });
      },
      dateFormat(row, column, cellValue, index){
          return row[column.property].replace(/T/g, ' ')                                           
      },
      search(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
        //记录当前分页
        this.recodesCurrentPages();
         this.$router.push({
          path:'reportManagemantEdit',
          query:{
            id:row.id
          }
        })
      },
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
          this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds="+checkedKeys.join(','))
          .then(res => {
            if(!res){
                this.logOff()
                return false;
            }
              this.$message('修改成功');
              this.dialogVisible = false;
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
      handleEdit(index, row){
        //记录当前分页
        this.recodesCurrentPages();
        this.$router.push({path: 'reportManagemantAdd', query: {id: row.id}})
      },
      handleDelete(index, row){ //删除列表
        var url = this.url;
        this.$confirm('此操作将永久删除该报表, 是否继续?', '提示',{
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type:'waring'
        }).then(() => {
          this.$http.post(url+"/api/Report/FileReportDelete",{id:row.id}).then(res => {
          if(!res){
              this.logOff()
              return false;
          }
          this.loadData();
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
      handleDetail(index,row){
         //记录当前分页
        this.recodesCurrentPages();
        this.$router.push({
          path:'reportManangementDetail',
          query:{
            id:row.id
          }
        })
      },
      correlationFn(row){
        var url = this.url;
        this.$http.post(url+"/api/Report/FileReportUpdateActive",{id:row.id,isActive:row.isActive}).then(res => {
        if(!res){
            this.logOff()
            return false;
        }
        this.loadData();
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        });
      },
      loadData(){

          //分页跳转
          let page = window.sessionStorage.getItem("paginationes");
          //设置是否记录当前分页信息
          if(page){
              var  getPages = JSON.parse(page)
              if(getPages){
                   var  myList = getPages.reportManagemantList;
                   if(myList){
                    this.tableData.pagination.pageNo = myList.currentPage;
                    this.tableData.pagination.pageSize = myList.pageSize;
                   }
              }
            }



          sysApi.userList({
             skipCount:this.tableData.pagination.pageSize*(this.tableData.pagination.pageNo-1),
             maxResultCount:this.tableData.pagination.pageSize
          })
          .then(res => {
            console.log(res)
            if(!res){
                this.logOff()
                return false;
            }
            this.tableData.rows = res.result.fileReportList;
            this.tableData.pagination.total = res.result.total;
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
              reportManagemantList:{
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
      this.loadData();
    }
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
</style>

