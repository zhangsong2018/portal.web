<template>

  <imp-panel>
     <h3 slot="body" class="box-title"  style="width: 100%;" >
      <!-- <el-row>
        角色设置
      </el-row> -->
      <el-row style="width: 100%; margin-bottom:15px;">
        <el-col :span="24">
          <router-link :to="{ path: 'roleAdd'}">
            
            <template v-if="contolAuth && contolAuth['Administration.Roles.Create']">
            <el-button type="primary" icon="el-icon-plus"  size="small" >新增</el-button>
            </template>
          </router-link>
        </el-col>
        <!-- <el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
                <el-input placeholder="请输入内容"  v-model="searchKey" @keyup.enter="search($event)">
                 <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
          </div>
        </el-col> -->
      </el-row>
    </h3>
    <div slot="body">
      <template v-if="tableData.rows.length>0">
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%" :header-row-style="tableHeadStyle"  height="700"
        v-loading="listLoading" :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange" :stripe="true">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <!-- <el-table-column
          prop="id"
          type="selection"
          width="50">
        </el-table-column> -->
        <el-table-column
          width="50" label="序号" type="index">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="displayName"
          label="角色">
        </el-table-column>
        <!-- <el-table-column
          label="是否静态">
          <template slot-scope="scope">
            {{ scope.row.isStatic ? '静态' : '非静态' }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="是否默认">
          <template slot-scope="scope">
            {{ scope.row.isStatic ? '默认' : '非默认' }}
          </template>
        </el-table-column> -->

        
        <el-table-column label="操作" width="445" fixed="right">
          <template slot-scope="scope">
            <!-- <template v-if="contolAuth && contolAuth['Administration.Roles.Menus']"> -->
             <el-button size="small" @click="gotoSetSystemPermissions(scope.$index,scope.row)" title="系统权限"  type="success">系统权限</el-button>
            <!-- </template> -->
            <template v-if="contolAuth && contolAuth['WorkBench']">
            <el-button size="small" @click="gotoSetworkAndDerictivePermissions(scope.$index,scope.row)" type="primary"  title="工作台权限"  >工作台权限</el-button>
            </template>
            <template v-if="contolAuth && contolAuth['Administration.Roles.Users']">
            <el-button size="small" @click="gotoSetRoleAndUsers(scope.$index,scope.row)" title="人员权限" type="warning">人员权限</el-button>
            </template>
            <template v-if="contolAuth && contolAuth['Administration.Roles.Edit']">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)" title="编辑" >编辑
                </el-button>
            </template>
            

            <template v-if="contolAuth && contolAuth['Administration.Roles.Delete']">
            <el-button
              size="small"
              @click="handleDelete(scope.$index, scope.row)" title="删除"  type="danger">删除
            </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNo"
        :page-sizes="[5, 10, 20]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination> -->
      
      </template>

      <!-- <el-dialog title="配置用户角色" v-model="dialogVisible" size="tiny">
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
      </el-dialog> -->
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  //import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'
  import {headers,headerAppX,deleteTipsObj} from '../../config/config'
  import {setTableHeadStyle,contolAuth} from '../../utils/utils'

  console.log('autList',contolAuth())
  import qs from 'qs'
  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        //控制权限
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
          // pagination: {
          //   total: 0,
          //   pageNo: 1,
          //   pageSize: 10,
          //   parentId: 0
          // },
          rows: []
        }
      }
    },
    methods: {
      //设置隔行颜色控制
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      search(target){
        this.loadData();
      },
      handleSelectionChange(val){

      },
      // handleRoleConfig(index, row){
      //   this.currentRow = row;
      //   this.dialogVisible = true;
      //   if (this.roleTree.length <= 0) {
      //     sysApi.roleList({selectChildren:true})
      //       .then(res => {
      //         this.roleTree = res
      //       })
      //   }
      //   this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
      //     .then(res => {
      //       this.$refs.roleTree.setCheckedKeys(res.data);
      //     }).catch(err=>{

      //   })
      // },
      
      // handleSizeChange(val) {
      //   this.tableData.pagination.pageSize = val;
      //   this.loadData();
      // },
      // handleCurrentChange(val) {
      //   this.tableData.pagination.pageNo = val;
      //   this.loadData();
      // },
      handleEdit(index, row){
        this.$router.push({path: 'roleAdd', query: {
          id: row.id,
          DisplayName:row.displayName,
          Name:row.name
        
        }})
      },
      handleDelete(index, row){
        this.$confirm(deleteTipsObj.tips, deleteTipsObj.title,{
             confirmButtonText: deleteTipsObj.confrimBtnText,
             cancelButtonText: deleteTipsObj.cancelBtnText,
             type:'waring'
        }).then(() => {
          let datas = {
             "Id":row.id
          }
          this.$http.post(api.SYS_ROLE_DEL,datas).then(res => {
          if(!res){
            this.logOff()
            return false;
          }
          this.loadData();
          this.$message({
            type: 'success',
            message: deleteTipsObj.success
          });
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: deleteTipsObj.cancel
          });          
        });
        
      },
      gotoSetSystemPermissions(index, row){
        this.$router.push({path: 'setSystemPermissions', query: {
          id: row.id
        }})
      },
      gotoSetworkAndDerictivePermissions(index,row){
        this.$router.push({path: 'setWorkAndDerictivePermissions', query: {
          id: row.id
        }})
      },
      gotoSetRoleAndUsers(index,row){
          this.$router.push({path: 'setRolesAndUsers', query: {
          id: row.id
        }})
      },
      // correlationFn(index, row){
      //     this.$router.push({
      //         path:'role',
      //         query:{
      //             id:row.id
      //         }
      //     })
      // },
      loadData(){
          // sysApi.userList({
          //   key: this.searchKey,
          //   pageSize: this.tableData.pagination.pageSize,
          //   pageNo: this.tableData.pagination.pageNo
          // })
          // .then(res => {
          //   this.tableData.rows = res.records;
          //   this.tableData.pagination.total = res.total;
          // });
          this.$http.post(api.SYS_ROLE_LIST, headers).then((res) => {
             if(!res){
              this.logOff()
              return false;
            }
            if(res.data.success){
               this.tableData.rows = res.data.result;
            }else{
              this.$message.error(res.data.error);
            }
          }).catch((err)=>{
            console.log(err)
          })
      },
      tableHeadStyle(){
        return setTableHeadStyle()
      }
    },
    created(){
      
    },
    mounted(){
      this.loadData();
    }
  }
</script>
<style scoped>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
   .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

