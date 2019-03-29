<template>
    <imp-panel  :title="form.id ? '系统权限':'系统权限'">
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="24" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <!-- <el-input v-model="search">
            <el-button slot="append">搜索</el-button>
        </el-input> -->
       <template v-if="roleTree">
          <el-tree 
                 :data="roleTree"
                 ref="roleTree"
                 show-checkbox
                 highlight-current
                   default-expand-all :default-checked-keys="showTree"
                 @node-click="handleNodeClick" clearable node-key="name" :props="defaultProps">
          </el-tree>
       </template>
       
      </el-col>
      
    </el-row>
     <el-row slot="body"  type="flex"  justify="flex-end" >
         <el-col class="flex-end">
              <!-- <template v-if="contolAuth && contolAuth['Administration.Roles.Menus']"> -->
                    <el-button size="small" @click="saveSetSystemPermissions()" type="primary">保存</el-button>
                    <el-button  size="small" @click="cancelSetSystemPermissions()">取消</el-button>
              <!-- </template> -->
      </el-col>
     </el-row>
    
  </imp-panel>
</template>
<script>
 import panel from "../../components/panel.vue"
//   import selectTree from "../../components/selectTree/selectTree.vue"
//   import treeter from "../../components/selectTree/selectTree.js"
  import * as sysApi from '../../services/sys'
  import * as api from "../../api"
  import {headers} from "../../config/config"
  import {contolAuth} from '../../utils/utils'
  
export default {
    //mixins: [treeter],
    
    data(){
        return{
            //控制权限
            contolAuth:contolAuth(),
             userList:null,
             search:'',
            // defaultProps: {
            //     children: 'children',
            //     label: 'name',
            //     id: "id",
            // },
            defaultProps:{
              children:'children',
              label:'displayName',
            },
            //被选中态的名称
            grantedPermissions:[],
            //设置树形的选中和展开
            showTree:[],
            resourceTree: [],
            form: {
                id: null,
                name: '',
                code: '',
                type: 1,
                sort: 0
            },
            dialogLoading:false,
            dialogVisible:false,
            formLabelWidth: '100px',
            roleTree: [],
            maxId:700000,
        }
    },
    created(){
        this.loadingDatas()
    },
    mounted(){

    },
    methods:{
        loadingDatas(){
            if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
                this.form.id = this.$route.query.id;
                this.$http.post(api.SYS_MENU_LIST,{
                    RoleId: this.form.id
                },headers).then((res)=>{
                        if(!res){
                            this.logOff()
                            return false;
                        }
                        this.roleTree = [];
                        this.roleTree.push(...res.data.result.permissions);
                        this.grantedPermissions = res.data.result.grantedPermissions
                        let datas =  res.data.result.permissions
                        this.deppCallback(datas);
                })
            }
        },

        deppCallback(arr){
            //默认选中态递归
            arr.forEach((el,index)=>{
                if(el.isGranted){
                    this.showTree.push(el.name);
                }
                if(el.children){
                    this.deppCallback(el.children);
                }
            })
        },
        saveSetSystemPermissions(){
            
            let list = this.$refs.roleTree.getCheckedNodes();
            this.grantedPermissions = this.getGrantedPermissions(list);
            this.$http.post(api.SYS_SET_SYSTEM_PERMISSION_SAVE,{
                RoleId:this.form.id,
                Permissions:this.grantedPermissions
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
                            
                        // }).catch((err) => {
                        //     console.log(err);
                            
                        // }); 
                        this.$router.push({path: 'roleList'})
                        this.$message.success('保存成功');
                 }else{
                     this.$message.error(res.data.error);
                 }
             }).catch((err)=>{
                 console.log(err);
             })
        },
        cancelSetSystemPermissions(){
                this.$confirm('您确定取消吗？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).then(()=>{
                    this.loadingDatas()
                    this.$router.push({path: 'roleList'})
                }).catch((err)=>{
                    console.log(err)
                })

        },
        

        getGrantedPermissions(list){
            //用户操作后将新的数组传递到提交数据里
            let trees = []
            list.forEach((el)=>{
               trees.push(el.name);
            })
            return trees;
            },
        handleNodeClick(data){
            //this.form = data;
            //console.log(data);
        },
        // renderContent(h, { node, data, store }){
        //     return (
        //     <span>
        //         <span>
        //         <span>{node.label}</span>
        //         </span>
        //         <span class="render-content">
        //         <i class="fa fa-wrench" title="配置资源" on-click={(e)=>this.settingResource(e,data.orgId)}></i>
        //         <i class="fa fa-trash" on-click={ () => this.deleteSelected(data.id) }></i>
        //         </span>
        //     </span>);
        // },
    },   
    components:{
        //'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },

    
}
</script>
<style scoped>
    .flex-end{
        display: flex;
        justify-content: flex-start;
    }
</style>

