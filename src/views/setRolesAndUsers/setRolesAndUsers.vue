<template>
    <!-- <div>
        机构和用户权限分配页面----
    </div> -->
      <imp-panel :title="1>0?'人员权限':'人员权限'">
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;" v-loading="treeLoading">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-input v-model="search" size="small" style="margin-bottom:10px;"  placeholder="输入部门名称进行搜索">
            <el-button slot="append" size="small">搜索</el-button>
        </el-input>
         <template v-if="contolAuth && contolAuth['Administration.Roles.Users']">
            <template v-if="roleTree">
                <!-- <el-tree 
                        :data="roleTree"
                        ref="roleTree" 
                        show-checkbox
                        highlight-current
                        :expand-on-click-node="false"
                        @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps" :filter-node-method="filterNode">
                </el-tree> -->
                <el-tree 
                        :data="roleTree"
                        ref="roleTree"
                        
                        highlight-current render-after-expand
                        :expand-on-click-node="false"
                        @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps" :filter-node-method="filterNode" >
                </el-tree>
            </template>
         </template>
       
      </el-col>
      <el-col  :span="18" :xs="24" :sm="24" :md="18" :lg="18">
          <div class="margin-bottom-10" v-if="form && form.length>0">
                <el-button @click="selectedAll" size="small">
                     全选
                </el-button>
                <el-button  @click="cancelSelectedAll"  size="small">
                    取消全选
                </el-button>
          </div>
           
          <template v-if="form&&form.length>0">
          <!-- <keep-alive> -->
          <el-table :data="form.slice((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)" border style="width: 100%"   :header-row-style="tableHeadStyle"  height="700"
        @selection-change="handleSelectionChange" ref="multipleTable" :stripe="true" :row-key="getRowKeys">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
                <el-table-column
                prop="id"
                type="selection"
                width="50"  :reserve-selection="true">
                </el-table-column>
                
                <el-table-column
                prop="name"
                label="名称">
                </el-table-column>
                <!-- <el-table-column
                prop="deepCode"
                label="deepCode">
                </el-table-column> -->
                
                <!-- <el-table-column
                prop="guid"
                label="guid标识">
                </el-table-column> -->

                <!-- <el-table-column
                prop="userName"
                label="人员登陆名">
                </el-table-column> -->
                <el-table-column
                prop="postName"
                label="岗位名称">
                </el-table-column>
                
                <el-table-column
                prop="departmentName"
                label="部门名称">
                </el-table-column>
                <!-- <el-table-column
                prop="hireDate"
                label="入职日期">
                </el-table-column> -->
                <el-table-column
               
                label="是否授权">
                <template slot-scope="scope">
                    {{ scope.row.isGranted?'是':'否'}}
                </template>
                </el-table-column>
        </el-table>
        <!-- </keep-alive> -->
        </template>
        <template v-else>
            <el-row>
                <el-col :span="24"><div class="grid-content nodatas fa fa-warning">暂无数据，点击左侧树状图搜索</div></el-col>
            </el-row>
        </template>
      </el-col>
    </el-row>

    <el-row  slot="body"  type="flex"  justify="space-between" style="margin-top:20px;" v-if="form&&form.length>0">
        <template v-if="contolAuth && contolAuth['Administration.Roles.Users']">
        
        <el-col type="flex"  justify="center" style="text:right">
            <el-button size="small" type="primary" @click="submitDatas">
               保存
            </el-button>
            <el-button size="small"  @click="returnPre" >
               返回
            </el-button>
        </el-col>
         <el-col  style="text:right">
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
        <!-- <el-checkbox v-model="checkedAll" @change="selectedAll">全选</el-checkbox> -->
       
        </el-col>
        </template>
    </el-row>
    <el-row slot="body" v-else>
        <el-col type="flex"  justify="center" style="text:right">
            <el-button size="small"  @click="returnPre"  type="primary">
               返回
            </el-button>
        </el-col>
    </el-row>
    
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import selectTree from "../../components/selectTree/selectTree.vue"
  import treeter from "../../components/selectTree/selectTree.js"
  import * as sysApi from '../../services/sys'
  import * as api from "../../api"
  import {headers,headerAppX,ROLESANDUSERS,pageSize} from "../../config/config"
  import {setTableHeadStyle,contolAuth} from '../../utils/utils'
  import qs from 'qs'
export default {
    mixins: [treeter],
    
    data(){
        return{
            //权限
            contolAuth:contolAuth(),
            userList:null,
            search:'',
            treeLoading:false,
            defaultProps:{
              children:'childOrgs',
              label:'chineseName',
            },
            resourceTree: [],
            rowId:null,
            //被选中的
            guids:[],
            //所有的guild数组
            AllUserCodes:[],
            form:[],
            dialogLoading:false,
            dialogVisible:false,
            listLoading:false,
            formLabelWidth: '100px',
            roleTree: [],
            maxId:700000,
            //分页
            tableData: {
                pagination: {
                    total: 1,
                    pageNo: 1,
                    pageSize: pageSize.ten
                }
            },
            totalCount:0,
            checkedAll:false
        }
    },
    watch: {
      search(val) {
        this.$refs.roleTree.filter(val);
      }
    },
    created(){
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null){
            this.rowId = this.$route.query.id
            this.$nextTick(()=>{
              this.loadingDatas()
            //console.log(this.tableData.rows[2])
        })
        }
    },
    mounted(){
        
         
    },
    methods:{
        selectedAll(){
            console.log("选中所有的数据");
            this.cancelSelectedAll();
             //是否全选
            let isGrantedLength = 0;
            this.form.forEach((el)=>{
                if(el.isChecked){
                    isGrantedLength++;
                }
            })
            // console.log('总数',totalCount)
            // console.log('被选中的数量',isGrantedLength)
            if(this.totalCount === isGrantedLength){
                this.checkedAll = true
            }else{
                this.checkedAll = false
            }
            if(!this.checkedAll){
                this.form.forEach((el)=>{
                el.isChecked=true;
                this.$refs.multipleTable.toggleRowSelection(el);
                //console.log(el)
                })
            }else{

            }
           
            //this.toggleSelection(this.form)
        },
        cancelSelectedAll(){
            this.form.forEach((el)=>{
                el.isChecked=false;
            })
            this.$refs.multipleTable.clearSelection();
        },

        // toggleSelection(rows) {
        //     console.log(rows.length)
        //     rows.forEach(row => {
        //         this.$refs.multipleTable.toggleAllSelection(row);
        //     });
        // },

        getRowKeys(row) {
            //console.log(row)
            return row.guid;
        },
        //分页效果
        handleSizeChange(val) {
            this.tableData.pagination.pageSize = val;
            
        },
        handleCurrentChange(val) {
            this.tableData.pagination.pageNo = val;
            

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
          })
        },
        handleNodeClick(data){
            //console.log(data)
            //this.form = data;
            this.treeLoading=true;
            this.settingResource(data.orgId)
        },
        lazyLoadTree(){
            console.log(11)
        },
        // renderContent(h, { node, data, store }){
        //     return (
        //     <span>
        //         <span>
        //         <span>{node.label}</span>
        //         </span>
        //         <span class="render-content">
        //         <i class="fa fa-wrench" title="配置资源" on-click={(e)=>this.settingResource(e,data.orgId)}></i>
        //         </span>
        //     </span>);
        // },
        settingResource(id){
            this.getUsersList(id)
        },
        getUsersList(id){
            console.log(id)
             if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
                 console.log(ROLESANDUSERS+"/"+api.SYS_ROLES_AND_USERS)
                //this.$http.post(ROLESANDUSERS+"/"+api.SYS_ROLES_AND_USERS,{
                  
                 let roleid = parseInt(this.rowId)
                //  let paras =  qs.stringify({
                //         OrgId: id,
                //         RoleId:  roleid
                //     })
                 let paras =  {
                        OrgId: id,
                        RoleId:  roleid
                    }
                
                this.$http.post(ROLESANDUSERS+"/"+api.SYS_ROLES_AND_USERS,paras).then((res)=>{
                    console.log(res);
                     if(!res){
                        this.logOff()
                        return false;
                    }
                    if(res.data.success){
                        
                        this.$nextTick(()=>{
                            //this.form = res.data.result.items
                            if(! res.data.result.items){
                                res.data.result.items = [];
                            }
                            this.AllUserCodes = [];
                            res.data.result.items.forEach((item,index)=>{
                                if(item.guid){
                                    this.AllUserCodes.push(item.guid)
                                }
                            })
                            this.form = res.data.result.items
                            //点击查询先取消全选再根据isGranted进行重新选择
                            if(this.$refs.multipleTable){
                                this.cancelSelectedAll()
                            }
                            
                            //新增一个isChecked,用于控制取消和全选状态
                            this.form.forEach((el,index)=>{
                                el.isChecked=el.isGranted?true:false
                            })


                            this.tableData.pagination.total =  res.data.result.items.length
                            
                            this.totalCount = res.data.result.totalCount;
                            this.isSeleAll(this.form,res.data.result.totalCount)


                            this.getPages(); 
                        })
                       
                    }else{
                        this.$message.error(res.data.result.error);
                    }
                    this.treeLoading=false;
                }).catch((res)=>{
                    console.log(res)
                })
             }
        },
        isSeleAll(lists,totalCount){
            //是否全选
            let isGrantedLength = 0;
            this.treeLoading=true;
            lists.forEach((el)=>{
                if(el.isChecked){
                    isGrantedLength++;
                }
            })
            // console.log('总数',totalCount)
            // console.log('被选中的数量',isGrantedLength)
            if(totalCount === isGrantedLength){
                this.checkedAll = true
            }else{
                this.checkedAll = false
            }
            this.treeLoading=false;
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
        handleSelectionChange(val){
            //console.log(val);
            
            this.guids = []
            val.forEach((el,index)=>{
                this.guids.push(el.guid)
            })
            //全选与否
            this.isSeleAll(val,this.totalCount);
        },
        //文本搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.chineseName.indexOf(value) !== -1;
        },

        tableHeadStyle(){
            return setTableHeadStyle()
        },
        //分页效果
        submitDatas(){
            //提交数据
            let params = {
                    RoleId: this.rowId,
                    UserCodes:  this.guids,
                    AllUserCodes:this.AllUserCodes
                }
            this.treeLoading=true;
            this.$http.post(api.SYS_ROLES_AND_USERS_SAVE,params).then((res)=>{
                console.log(res);
                if(!res){
                    this.logOff()
                    return false;
                }

                if(res.data.success){
                //     this.$confirm('选择成功，您确认返回列表吗？','提示',{
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type:'success'
                // }).then(()=>{
                //     this.$router.push({path: 'roleList'})
                // }).catch((err)=>{
                //     console.log(err)
                // })
                    this.$message.success('保存成功！')
                }else{
                    this.$message.error('发生了意想不到的错误')
                }
                this.treeLoading=false;
            })
        },
        cancelDatas(){
            this.$confirm('您确定取消吗？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(()=>{
                    this.$router.push({path: 'roleList'})
                }).catch((err)=>{
                    console.log(err)
                })
        },
        returnPre(){
            this.$router.push({path: 'roleList'})
        }

    },   
    components:{
        'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },

    
}
</script>
<style scoped>
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #67c23a;
    }
    .nodatas{
        min-height: 300px;
        justify-content: center;
        align-items: center;
        display: flex;
    }
</style>



