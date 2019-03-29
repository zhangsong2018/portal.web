<template>
    <!-- <div>
        机构和用户权限分配页面----
    </div> -->
      <imp-panel :title="1>0?'配置机构和人的关系':''">
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
        <el-input v-model="search">
            <el-button slot="append">搜索</el-button>
        </el-input>
       <template v-if="roleTree">
          <el-tree 
                 :data="roleTree"
                 ref="roleTree"
                 show-checkbox
                 highlight-current
                  :render-content="renderContent"
                 @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps">
          </el-tree>
       </template>
       
      </el-col>
      <el-col>
        
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
  import {headers} from "../../config/config"
export default {
    mixins: [treeter],
    
    data(){
        return{
             userList:null,
             search:'',
            // defaultProps: {
            //     children: 'children',
            //     label: 'name',
            //     id: "id",
            // },
            defaultProps:{
              children:'childOrgs',
              label:'chineseName',
            },
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
            //console.log('加载中。。。');
            // this.$http.post(api.SYS_WORK_BENCH_QUERY_DEL,{
            //   id:row.id
            // },headers).then(res => {
            // this.loadingDatas();
            // this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });
            // });


        //     sysApi.rolesList().then(res => {
        //         this.roleTree = [];
        //         console.log(123)
        //         console.log(res.result)
        //         this.roleTree.push(...res.result)
        //         console.log(this.roleTree);
        //   })

        this.$http.post(api.SYS_INST_ANS_POWER_DIVCE,headers).then((res)=>{
              console.log(res)
                this.roleTree = [];
                console.log(123)
                console.log(res.data.result.structList)
                this.roleTree.push(...res.data.result.structList)
                console.log(this.roleTree);
          })
        },
        handleNodeClick(data){
            this.form = data;
        },
        renderContent(h, { node, data, store }){
            console.log(node)

            return (
            <span>
                <span>
                <span>{node.label}</span>
                </span>
                <span class="render-content">
                <i class="fa fa-wrench" title="配置资源" on-click={(e)=>this.settingResource(e,data.orgId)}></i>
                <i class="fa fa-trash" on-click={ () => this.deleteSelected(data.id) }></i>
                </span>
            </span>);
        },
        settingResource(e,id){
            console.log(e)
            console.log(data)
            


        },
        getUsersList(e,id){
            this.form.id

            
             this.$http.post('/api/org/OrgStaffs',{
                OrgId:
                RoleId
             },headers)
        }
    },   
    components:{
        'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },

    
}
</script>
<style>

</style>


