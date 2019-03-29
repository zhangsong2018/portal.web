<template>
    <imp-panel>
        <el-row>
            <el-col  :span="6">
                    <el-input placeholder="请选择关键人员" >
                        <i
                            class="el-icon-search el-input__icon"
                            slot="suffix"
                            @click="handleIconClick">
                        </i>
                    </el-input>
            </el-col>
        </el-row>
        <el-row class="set-seleced-box">
            <el-col  :span="24"  v-if="isSelectedList && isSelectedList.length>0">
                    <div class="min-height" :class="{'height-auto':isHeightAutoKeys}">
                        <div class="more-class-info" ref="moreClassInfoKeys">
                            <el-tag v-for="item in  isSelectedList" size="medium" closable @close="tagClose(item)" :key="item.id">{{item.name}}</el-tag>
                        </div>
                    </div>
                     <div class="demo-block-control set-more-style" v-if="showMoreClassInfoKeys">
                        <i class="my-more" :class="{'el-icon-caret-bottom':!isHeightAutoKeys,'el-icon-caret-top':isHeightAutoKeys}"  @click="setMore('isHeightAutoKeys')"></i>
                     </div>
            </el-col>
           <el-col  :span="24"  v-else>
                    暂无数据
            </el-col>
        </el-row>
        
        <div>
        <span class="red">*</span>关键信息：
        <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
        </el-select>
        <el-row class="height-30">
             <el-col :span="24" ></el-col>
        </el-row>
        <el-row  class="my-row">
             <el-col :span="24" >
                <span  class="red">*</span>显示方式：
                 <el-select v-model="showStyle" placeholder="请选择">
                        <el-option
                        v-for="item in showStyleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                </el-select>
                     <el-button  @click="selectedStrut()"  type="primary" style="margin-left:20px;">点击选择</el-button>
                
             </el-col>

             
        </el-row>
        <el-row class="set-seleced-box">
            <el-col  :span="24"  v-if="isSelectedListShow && isSelectedListShow.length>0">
                <div class="min-height" :class="{'height-auto':isHeightAuto}">
                    <div class="more-class-info" ref="moreClassInfo">
                        <el-tag v-for="item in  isSelectedListShow" size="medium" closable @close="tagCloseShow(item)" :key="item.id">{{item.name}}</el-tag>
                    </div>
                </div>
                <div class="demo-block-control set-more-style" v-if="showMoreClassInfo">
                   


                    <i class="my-more" :class="{'el-icon-caret-bottom':!isHeightAuto,'el-icon-caret-top':isHeightAuto}"    @click="setMore('isHeightAuto')"></i>
                </div>
            </el-col>
           <el-col  :span="24"  v-else>
                    暂无数据
            </el-col>
        </el-row>
        </div>
        <el-dialog title="请选择" :visible.sync="outerVisible" center :width="dWidth">
            <el-row  :gutter="24" style="margin-bottom: 20px;" v-loading="treeLoading">
                    <el-col  style="margin-bottom: 20px;width:300px">
                        <el-input v-model="search" size="small" style="margin-bottom:10px;"  placeholder="输入部门名称进行搜索">
                            <el-button slot="append" size="small">搜索</el-button>
                        </el-input>
                        <template>
                            <template v-if="roleTree">
                                <el-tree 
                                        :data="roleTree"
                                        ref="roleTree"
                                        highlight-current render-after-expand
                                        :expand-on-click-node="false"
                                        @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps" :filter-node-method="filterNode" style="height:500px;overflow: auto;width:230px;">
                                </el-tree>
                            </template>
                        </template>
                    
                    </el-col>
                    <el-col :width="tWidth" style="width:540px;margin-left: 20px;">
                        <div class="margin-bottom-10" v-if="form && form.length>0">
                                <el-button @click="selectedAll" size="small">
                                    全选
                                </el-button>
                                <el-button  @click="cancelSelectedAll"  size="small">
                                    取消全选
                                </el-button>
                        </div>
                        <template v-if="form&&form.length>0">
                        <el-table :data="form.slice((tableData.pagination.pageNo-1)*tableData.pagination.pageSize,tableData.pagination.pageNo*tableData.pagination.pageSize)" border style="width: 100%"   :header-row-style="tableHeadStyle"  height="500"
                        @selection-change="handleSelectionChange" ref="multipleTable" :stripe="true" :row-key="getRowKeys">
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

                    <el-row  type="flex"  justify="space-between" style="margin-top:20px;" v-if="form&&form.length>0">
                        <template v-if="contolAuth && contolAuth['Administration.Roles.Users']">
                        
                    
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
                        </template>
            </el-row>
        </el-dialog>
        <el-row>
            <el-col>
                    <el-button>取消</el-button><el-button type="primary">确定</el-button>
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
  import {headers,headerAppX,ROLESANDUSERS,pageSize,contactsList,contactsShowStyle} from "../../config/config"
  import {setTableHeadStyle,contolAuth} from '../../utils/utils'
  import qs from 'qs'
export default {
    name:"concats",
    data(){
        return {
            dWidth:'900px',
            tWidth:'600px',
            value:'手机号',
            options:contactsList,
            showStyle:'公开，但以下人员不公开',
            showStyleList:contactsShowStyle,
            selectRow:'',
            outerVisible:false,//弹出
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
            checkedAll:false,
            //展示方式的显示和隐藏
            isHeightAutoKeys:false,
            showMoreClassInfoKeys:false,
            //关键人员的展示和隐藏
            isHeightAuto:false,
            showMoreClassInfo:false,
            isSelectedList:[
            {
                id:0,
                name:'康总'
            },
            {
                id:1,
                name:'赵总'
            }
            ],
            isSelectedListShow:[
            {
                id:0,
                name:'新来的0'
            },
            {
                id:1,
                name:'新来的1'
            },
             {
                id:2,
                name:'新来的2'
            },
            {
                id:3,
                name:'新来的3'
            },
             {
                id:4,
                name:'新来的4'
            },
            {
                id:5,
                name:'新来的5'
            },
            {
                id:6,
                name:'新来的0'
            },
            {
                id:7,
                name:'新来的1'
            },
             {
                id:8,
                name:'新来的2'
            },
            {
                id:9,
                name:'新来的3'
            },
             {
                id:10,
                name:'新来的4'
            },
            {
                id:11,
                name:'新来的5'
            },
            {
                id:12,
                name:'新来的3'
            },
            
           
            ]
        }
    },
    //  watch: {
    //   search(val) {
    //     this.$refs.roleTree.filter(val);
    //   }
    // },
    created(){
       
    },
    mounted(){

        //关键人员的展示和隐藏
        //显示方式展示与隐藏
        if(this.isSelectedList.length>0){
            this.setMoreHeight('moreClassInfoKeys','showMoreClassInfoKeys');
            window.onresize = ()=>{
                this.setMoreHeight('moreClassInfoKeys','showMoreClassInfoKeys')
            }
        }
        
        //显示方式展示与隐藏
        if(this.isSelectedListShow.length>0){
            this.setMoreHeight('moreClassInfo','showMoreClassInfo');
            window.onresize = ()=>{
                this.setMoreHeight('moreClassInfo','showMoreClassInfo')
            }
        }
        
    },
    methods: {
        setMoreHeight(refsNames,showMore){
                 let aHeight = this.$refs[refsNames].getBoundingClientRect().height;
                if(aHeight<=76){
                    console.log(111222)
                    this[showMore] = false; 
                    this.$refs[refsNames].parentNode.style.height = this.$refs[refsNames].getBoundingClientRect().height + "px"
                }else{
                    this[showMore] = true;
        }
        },
        handleIconClick(){},
        selectedStrut(el){
                this.outerVisible = true;
                this.treeLoading = true;
                this.$route.query.id = 54;
                    if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null){
                    this.rowId = this.$route.query.id
                    this.$nextTick(()=>{
                    this.loadingDatas()
                    this.treeLoading = false;
                })
            }
        },
        setMore(type){
            console.log(type)
           this[type]=!this[type];
        },
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
        // renderContent(h, { node, data, store }){
        //     return(
        //             <span class='fa fa-home'>{node.label}</span>
        //     )
        // },
        tableHeadStyle(){
            return setTableHeadStyle()
        },
        //分页效果
        submitDatas(){
            //提交数据
            // let params = {
            //         RoleId: this.rowId,
            //         UserCodes:  this.guids,
            //         AllUserCodes:this.AllUserCodes
            //     }
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
        },
        //删除标签
        tagClose(isItem){
            this.isSelectedList.forEach((item,index)=>{
                if(isItem.id === item.id){
                    this.isSelectedList.splice(index, 1);
                }
            })
        },
        tagCloseShow(isItem){
             this.isSelectedListShow.forEach((item,index)=>{
                if(isItem.id === item.id){
                    this.isSelectedListShow.splice(index, 1);
                }
            })
        }

    },
     components:{
        'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },
}
</script>
<style scoped>
    .height-30{
        height: 30px;
    }
    .my-row{
        height: 60px;
    }
    .my-row .el-radio{
        margin-left: 20px;
    }
    .set-seleced-box{
        border: 1px solid #eee;
        border-radius: 4px;
        margin: 20px 0;
        padding: 20px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
        margin-bottom: 10px;
    }
    .red{
        color: red;
    }
    .set-more-style{
        text-align: center;
    }
    .min-height{
        height: 76px;
        overflow: hidden;
    }
    .min-height.height-auto{
        height: auto;
    }
    .my-more:hover{
        color: #409EFF;
        cursor: pointer;
    }
    

    
</style>
