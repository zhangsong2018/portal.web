<template>
    
  <imp-panel>
    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
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
export default {
    mixins: [treeter],
    components:{
        'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },
    data: function () {
        return{
            userList:null,
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
        let user = {
            pass:'123',
            name:'123'
        }
        this.getDatas(user);
    },
    mounted(){},
    methods:{
      getDatas(pras){
           let that = this;
           sysApi.rolesList(pras).then((res)=>{
            console.log(res.result.structList)
            that.$nextTick(()=>{
                this.$set(this,'userList',res.result.structList)
                this.userList = res.result.structList;
                console.log( this.userList )
                this.load();
            })
           
            
        }).catch((res)=>{
            console.log(res);
        })
        },

      handleNodeClick(data){
        this.form = data;
      },
      load(){
        sysApi.rolesList().then(res => {
            this.roleTree = [];
            console.log(res.result.structList)
            this.roleTree.push(...res.result.structList)
            console.log(this.roleTree);
          })
        //  sysApi.roleList().then(res => {
        //      console.log(res);
        //      //debugger;
        //     this.roleTree = [];
        //     this.roleTree.push(...res)
        //   })
      },
      renderContent(h, { node, data, store }){
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
      settingResource(e,orgId){
        console.log(orgId)
      },
      deleteSelected(){
        this.$http.get(api.SYS_ROLE_DELETE + "?roleIds=" + id)
          .then(res => {
            this.$message('操作成功');
            this.deleteFromTree(this.roleTree, id);
            this.newAdd();
          }).catch(e =>{
          this.$message('操作成功');
          this.deleteFromTree(this.roleTree, id);
          this.newAdd();
        })
      }
    }

}
</script>
<style scoped>


</style>


