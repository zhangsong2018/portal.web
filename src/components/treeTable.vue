<template>
    <div class="flex-center">
                <el-row  :gutter="24" v-loading="treeLoading" class="flex-center-main">
                    <el-col class="left-tree-box">
                        <el-input v-model="search" size="small" style="margin-bottom:10px;"  placeholder="输入部门名称进行搜索">
                            <el-button slot="append" size="small">搜索</el-button>
                        </el-input>
                            <template v-if="roleTree&&roleTree.length>0">
                               
                                <el-tree 
                                        :lazy="false"
                                        :data="roleTree"
                                        ref="roleTree"
                                        highlight-current render-after-expand
                                        :expand-on-click-node="false"
                                        @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps" :filter-node-method="filterNode" class="tree-node-contain">
                                </el-tree>
                            </template>
                    
                    </el-col>
                    <el-col :width="tWidth" class="set-width-css">
                        <div class="margin-bottom-5 margin-top-5 text-left" v-if="form && form.length>0">
                                <el-button @click="selectedAll" size="small" type="primary" plain>
                                    全选
                                </el-button>
                                <el-button  @click="cancelSelectedAll"  size="small"  plain>
                                    取消全选
                                </el-button>

                                <!-- <el-button  @click="resetAll"  size="small"  plain title="">
                                    重置
                                </el-button> -->
                        </div>
                        <template v-if="form&&form.length>0">
                        <keep-alive>
                            <el-table :data="form.slice((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)" border style="width: 100%"   :header-row-style="tableHeadStyle"  height="500"
                            @selection-change="handleSelectionChange" ref="multipleTable" :stripe="true" :row-key="getRowKeys" @select="selecedFn" @select-all="selecteTableAll">
                                    <el-table-column
                                    prop="id"
                                    type="selection"
                                    width="50"  :reserve-selection="true">
                                    </el-table-column>
                                    <el-table-column
                                    prop="name"
                                    label="名称">
                                    </el-table-column>
                                    <el-table-column
                                    prop="postName"
                                    label="岗位名称">
                                    </el-table-column>
                                    <el-table-column
                                    prop="departmentName"
                                    label="部门名称">
                                    </el-table-column>
                                    <!-- <el-table-column
                                    label="是否授权">
                                        <template slot-scope="scope">
                                            {{ scope.row.isGranted?'是':'否'}}
                                        </template>
                                    </el-table-column> -->
                            </el-table>
                        </keep-alive>
                        </template>
                        <template v-else>
                            <el-row>
                                <el-col :span="24"><div class="grid-content nodatas"><span class=" fa fa-warning"></span> 暂无数据，点击左侧树状图搜索</div></el-col>
                            </el-row>
                        </template>
                    </el-col>
                </el-row>

                <el-row  type="flex"  justify="space-between" style="margin-top:20px;" v-if="form&&form.length>0">
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
                    
                        </el-col>
                        <el-col type="flex"  justify="center" style="text:right">
                            <el-button size="small" type="primary" @click="submitDatas">
                            保存
                            </el-button>
                        </el-col>
                </el-row>
    </div>
</template>
<script>
  import panel from "../components/panel.vue"
  import selectTree from "../components/selectTree/selectTree.vue"
  import treeter from "../components/selectTree/selectTree.js"
  import * as sysApi from '../services/sys'
  import * as api from "../api"
  import {headers,ROLESANDUSERS,pageSize} from "../config/config"
  import {setTableHeadStyle,contolAuth} from '../utils/utils'
  import qs from 'qs'
  //引入lodsh处理数据并交补差等
  import _ from 'lodash'
export default {
    props:{
        //业务逻辑处理
        //guids
        propOrgGuids:{
            type:Array,
            default:function(){
                return [];
            },
        },
        //orgId
        porpOrgRoleId:{
            type:Number,
            default:null,
        },
        //树格式
        propTree:{
          type:Object,
          default:function(){
              return {
                children:'childOrgs',
                label:'chineseName',
              }
            },
        },
        //分页设置
        propPageNum:{
            type:Number,
            default:10,
        },
        propPageTypes:{
            type:Array,
            default:function(){
                return [5, 10, 20]
            }
        },

        //页面样式设置
        //表格样式
        propTableHeader:{
            type:Object,
            default:function(){
                return {}
            }
        },
        //组件的宽和高
        propTWidth:{
            type:String,
            default:'900px'
        },
        propBWidth:{
            type:String,
            default:'600px'
        },

        
    },
    data(){
        return {
            dWidth:this.propTWidth,
            tWidth:this.propBWidth,
            selectRow:'',
             //权限
            contolAuth:contolAuth(),
            userList:null,
            search:'',
            treeLoading:false,
            defaultProps:this.propTree,
            resourceTree: [],
            rowId:this.porpOrgRoleId,
            //被选中的
            guids:[],
            //传递过来的原始数据
            guidCheckedOrg:this.propOrgGuids,
            //操作后的数据
            guidChecked:[],
            pageTypes:this.propPageTypes,
            //所有的guild数组
            AllUserCodes:[],
            //获取当前点击时的选中的节点form
            form:[],
            listLoading:false,
            roleTree: [],
            //分页
            tableData: {
                pagination: {
                    total: 1,
                    pageNo: 1,
                    pageSize: this.propPageNum
                }
            },
            totalCount:0,
            checkedAll:false,
        }
    },
    created(){
        this.guidChecked = this.getOrgDatas(this.guidCheckedOrg);
        //console.log(this.guidChecked);
        //this.selectedStrut();
        
    },
    mounted(){
        //加载数据
        this.$nextTick(()=>{
            this.selectedStrut();
        })
        
    },
    methods:{
        resetAll(){
             this.guidChecked = this.getOrgDatas(this.guidCheckedOrg);
        },
        getOrgDatas(arr){
            //获取初始化数据
            var myArr = JSON.stringify(arr);
            return JSON.parse(myArr);
        },
        selectedStrut(el){
            this.treeLoading = true;
            this.$nextTick(()=>{
                this.loadingDatas()
               
            })
        },
        selectedAll(){
            console.log("选中所有的数据");
            this.treeLoading = true;
            this.cancelSelectedAll();
             //是否全选
            let isGrantedLength = 0;
            this.form.forEach((el)=>{
                if(el.isChecked){
                    isGrantedLength++;
                }
            })
            if(this.totalCount === isGrantedLength){
                this.checkedAll = true
            }else{
                this.checkedAll = false
            }
            if(!this.checkedAll){
                this.form.forEach((el)=>{
                el.isChecked=true;
                this.$refs.multipleTable.toggleRowSelection(el);
                })
            }else{

            }

            /*
            this.form.forEach((el)=>{
                el.isChecked=true;
                el.isGranted=true;
                this.$refs.multipleTable.toggleRowSelection(el);
            });
            
            */
           //将选中数据插入到this.guidChecked中
           this.form.map((el,index)=>{
               //如果操作的选中数组中
               if( this.guidChecked.indexOf(el.guid) ===-1 ){
                   this.guidChecked.push(el.guid);
               }
           })


            this.treeLoading = false;
            //让页面回到第一页
            //this.tableData.pagination.pageNo=1;
        },
        // thatSelected(selection, row){
        //     console.log(selection);
        //     console.log(row);
        // },
        cancelSelectedAll(){
            console.log(111);
            this.form.forEach((el)=>{
                el.isChecked=false;
            })

            this.form.forEach((el,index)=>{
                this.guidChecked.forEach((checked,inof)=>{
                    if(el.guid === checked){
                        this.guidChecked.splice(inof,1);
                    }
                })
            })
            this.$refs.multipleTable.clearSelection();
        },

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

               
                this.$nextTick(()=>{
                     this.roleTree = [];
                    this.roleTree.push(...res.data.result.structList);
                    this.treeLoading = false;
                })
                
            }).catch(()=>{
                this.treeLoading = false;
            })
        },
        handleNodeClick(data){
            //点击左侧树
            this.treeLoading=true;
             console.log(this.guidChecked);
            //this.getUsersList(data.orgId);
            let roleid = parseInt(this.rowId)
                //  let paras =  qs.stringify({
                //  OrgId: id,
                //  RoleId:  roleid
                //     })
                 let paras =  {
                        OrgId: data.orgId,
                        //RoleId:  54
                    }
                
                this.$http.post(ROLESANDUSERS+"/"+api.SYS_ROLES_AND_USERS,paras).then((res)=>{
                  //  console.log(res);
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
                                //点击树叶子时将数据反填回来
                                this.guidChecked.forEach((checkedItem,index)=>{
                                    if(item.guid === checkedItem){
                                        item.isGranted = true;
                                        item.isChecked = true;
                                    }
                                })
                            })
                             //console.log(res.data.result.items);
                            //获取当前点击时的选中的节点
                            this.form = res.data.result.items
                            //点击查询先取消全选再根据isGranted进行重新选择
                            // if(this.$refs.multipleTable){
                            //     this.cancelSelectedAll()
                            // }
                            //新增一个isChecked,用于控制取消和全选状态
                            // this.form.forEach((el,index)=>{
                            //     el.isChecked=el.isGranted ? true:false
                            // })
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

                console.log(this.guidChecked);
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

            //console.log(isGrantedLength)

            if(totalCount === isGrantedLength){
                this.checkedAll = true
            }else{
                this.checkedAll = false
            }
            this.treeLoading=false;
        },

        getPages(){
            //获取页面
            let that = this;
            this.$nextTick(()=>{
                setTimeout(()=>{
                // console.log(this.form)
                    this.form.forEach((el,index)=>{
                        if(el.isGranted){
                            this.$refs.multipleTable.toggleRowSelection(this.form[index],true);
                        }
                    })
                },500)
            })
            
        },
        selecteTableAll(section){
           //选中当前的页面的table页面
            console.log(section);
           var currentPageDatas =  this.form.slice((this.tableData.pagination.pageNo-1)*this.tableData.pagination.pageSize,this.tableData.pagination.pageNo*this.tableData.pagination.pageSize);
           console.log(currentPageDatas);
           
            this.guids = [];
            // section.forEach((el,index)=>{
            //     this.guids.push(el.guid);
            //     this.guidChecked.push(el.guid);
            //     el.isGranted = true;
            //     el.isChecked = true;
            // })
            
            var arr1 = [],arr2=[];
            section.map((el,index)=>{
                arr1.push(el.guid);
            })
            currentPageDatas.forEach((el,index)=>{
                arr2.push(el.guid);
            });

           
           var isSelected = this.isContained(arr1,arr2)
            if(isSelected){
                currentPageDatas.forEach((el,index)=>{
                el.isChecked = true;
                this.guidChecked.push(el.guid);
                })
            }else{
                currentPageDatas.forEach((el,index)=>{
                    el.isChecked = false;

                    let isInfo =  this.guidChecked.indexOf(el.guid)
                    if(isInfo!=-1){
                        console.log(isInfo)
                        this.guidChecked.splice(isInfo,1);
                    }
                    
                })
            }
            


            this.isSeleAll(section,this.totalCount);



        },
         isContained (a, b){
                if(!(a instanceof Array) || !(b instanceof Array)) return false;
                if(a.length < b.length) return false;
                var aStr = a.toString();
                for(var i = 0, len = b.length; i < len; i++){
                if(aStr.indexOf(b[i]) == -1) return false;
                }
                return true;
            },
        handleSelectionChange(val){
           //console.log(val);
        },
        selecedFn(val,row){
            //点击当前列
            row.isChecked = !row.isChecked;
            val.forEach((el,index)=>{
                if(el.guid === row.guid){
                    if(el.isChecked){
                        el.isGranted = true;
                    }
                }
            })

            //新增数据guid
            if(row.isChecked){
                this.addGuidFn(row);
            }else{
                this.removeGuid(row);
            }


        },
        addGuidFn(row){
            //追加Guid函数
            //数组中是否包含指定的元素
            var iSPush = this.guidChecked.indexOf(row.guid)
            if(iSPush===-1){
                this.guidChecked.push(row.guid);
            }
        },
        removeGuid(row){
            //删除当前取消选中的Guid函数
            //删除被选中的数据
            for(let i=0;i<this.guidChecked.length;i++){
                if(this.guidChecked[i]===row.guid){
                    console.log(this.guidChecked[i])
                    this.guidChecked.splice(i,1);
                }
            }
        },
        //文本搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.chineseName.indexOf(value) !== -1;
        },
        tableHeadStyle(){
            return setTableHeadStyle()
        },
        submitDatas(){
            //提交数据
            let params = {
                    RoleId: this.rowId,
                    UserCodes:  this.guids,
                    AllUserCodes:this.AllUserCodes
                }
                this.guidChecked = _.uniq(this.guidChecked);
                console.log(this.guidChecked);
                console.log(this.guidCheckedOrg);
                //1、原始数据中有，最后保存时没有的guid
                let checkedBecomeCancel = _.difference(this.guidCheckedOrg,this.guidChecked);
                console.log(checkedBecomeCancel);
                //2、原始数据没有，保存时有的guid
                let checkedBecomeAdd = _.difference(this.guidChecked,this.guidCheckedOrg);
                    console.log(checkedBecomeAdd);
                    //checkedBecomeCancel
                let checkedBecomeCancelPerson = [];
                    checkedBecomeCancel.forEach((el,index)=>{
                        let obj = {
                            guid:el,
                            isCheckedBefore:true,
                            isCheckedEnd:false
                        }
                        checkedBecomeCancelPerson.push(obj)
                    })
                let checkedBecomeAddPerson = [];
                checkedBecomeAdd.forEach((el,index)=>{
                    let obj = {
                            guid:el,
                            isCheckedBefore:false,
                            isCheckedEnd:true
                    }
                    checkedBecomeAddPerson.push(obj);
                })
                // let userDatas = checkedBecomeCancelPerson.concat(checkedBecomeAddPerson)
                let datas={
                    usersCancel: checkedBecomeCancelPerson,
                    usersAdd: checkedBecomeAddPerson,
                    roleId:1
                }


                console.log(datas);
                this.$emit('getDatas',datas);








                //console.log(params)
            // this.treeLoading=true;
            // this.$http.post(api.SYS_ROLES_AND_USERS_SAVE,params).then((res)=>{
            //     console.log(res);
            //     if(!res){
            //         this.logOff()
            //         return false;
            //     }

            //     if(res.data.success){

            //         this.$message.success('保存成功！')
            //     }else{
            //         this.$message.error('发生了意想不到的错误')
            //     }
            //     this.treeLoading=false;
            // })

        },
    },
    components:{
        'el-select-tree': require('./selectTree/selectTree.vue').default
    }
}
</script>
<style scoped>
    .margin-bottom-5{
        margin-bottom: 5px;
    } 
    .margin-top-5{
        margin-top: 5px;
    }
    .flex-center-main{
        margin-bottom: 20px;
    }
    .flex-center{
        margin: 10px auto;
        text-align: center;
        width: 860px;
    }
    .set-width-css{
        padding-left: 12px;
        padding-right: 12px;
        width: 540px;
        margin-left: 20px;
        border: 1px solid #ddd;
        margin-left: 20px;
        border: 1px solid #ddd;
        height: 564px;
    }
    .tree-node-contain{
        height:500px;
        overflow: auto;
        width:284px;
    }
    .left-tree-box{
        margin-bottom: 20px;
        width:300px;
        border:1px solid #ddd;
        padding-top:10px;
        padding-bottom: 10px; 
        background: #fff;
     }
     .nodatas{
        padding-top: 50%;
     }
     .text-left{
         text-align: left;
     }
    
</style>

