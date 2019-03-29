<template>
    <imp-panel >
        <div  
            v-loading="loading"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)" :style="{'height':windowHeight}">
        <el-row  :style="{'height':bodyHeight}" :gutter="24">
             <el-col  :span="6">
                <el-tree 
                    :data="roleTree"
                    ref="roleTree"
                    highlight-current render-after-expand
                    :expand-on-click-node="false"  :default-expanded-keys="[0,1,2,3,4,5]"
                    @node-click="handleNodeClick" clearable node-key="orgId" :props="defaultProps" :filter-node-method="filterNode" style="overflow: auto;border: 1px solid #eee;"  
                    :style="{'height':treeHeight}">
                    </el-tree>
            </el-col>
             <el-col  :span="18">
                 <template  v-if="!selecedId">
                     
                 <div>
                     说明：请在请在左侧的树状图中选中相应的部门名称进行再进行设置
                 </div>
                 </template>
                 <template  v-else>
                <div class="flex flex-btween margin-btm-20" v-loading="loadingData"> 
                            <div>说明：请在编辑器中填写部门职责并保存， 保存后点击启用后方可生效</div>  
                            <el-switch
                                v-model="value2"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开启"
                                inactive-text="关闭"
                                :width="50"
                                >
                            </el-switch>
                            
                        </div>
                        
                        <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="textarea">
                        </el-input>
                </template>
             </el-col>
            
        </el-row>
        <el-row >
                <el-col >
                    <el-button type="primary">保存</el-button>
                </el-col>
        </el-row>
        
        </div>
    </imp-panel>
</template>
<script>
import panel from "../../components/panel.vue"
  import selectTree from "../../components/selectTree/selectTree.vue"
  import treeter from "../../components/selectTree/selectTree.js"
  import * as api from "../../api"
  import {headers,headerAppX,ROLESANDUSERS,pageSize,contactsList,contactsShowStyle} from "../../config/config"
  import {setTableHeadStyle,contolAuth} from '../../utils/utils'
  import qs from 'qs'
export default {
    name:"concats",
    data(){
        return {
             defaultProps:{
              children:'childOrgs',
              label:'chineseName',
            },
            roleTree: [],
            loading:false,
            value2:false,
            textarea:'',
            selecedId:null,
            loadingData:false
        }
    },
    created(){
       this.loadingDatas()
    },
    mounted(){

    },
    methods: {
        loadingDatas(){
            this.loading = true;
            this.loadingData = true;
            this.$http.post(api.SYS_INST_ANS_POWER_DIVCE,headers).then((res)=>{
                console.log(res)
                if(!res){
                this.logOff()
                return false;
                }
                
                this.roleTree = [];
                this.roleTree.push(...res.data.result.structList);
                this.loading = false;
                this.loadingData = false;
            })
        },
         handleNodeClick(data){
            //console.log(data)
            //this.form = data;
            this.treeLoading=true;
            this.settingResource(data.orgId)
            
        },
        //文本搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.chineseName.indexOf(value) !== -1;
        },
        settingResource(id){
            this.getUsersList(id)
        },
        getUsersList(id){
            this.selecedId = id;
            if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {

            }
        }
    },
    computed:{
        windowHeight(){
            return window.screen.availHeight-340+"px";
        },
        bodyHeight(){
             return window.screen.availHeight-340+"px";
        },
        treeHeight(){
            return window.screen.availHeight-460+"px";
        }
    },
     components:{
        'el-select-tree': require('../../components/selectTree/selectTree.vue').default
    },
}
</script>
<style scoped>
  .flex{
      display: flex;
  }
  .flex-btween{
      justify-content: space-between;
  }
  .margin-btm-20{
      margin-bottom: 20px;
  }
    

    
</style>

