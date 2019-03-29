<template>
    <imp-panel>
     <div slot="body">
        <el-row span=24 > 
          <router-link :to="{ path: 'contactsAdd'}">
               <el-button size="small" type="primary">添加</el-button>
          </router-link>
        </el-row>
        <template v-if="tableData.rows.length>0">
        <el-table
            :data="tableData.rows"
            border
            style="width: 100%;margin-top:20px;" :header-row-style="tableHeadStyle"  height="700"
            v-loading="listLoading" :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange" :stripe="true">
            <el-table-column
            width="150" label="关键人姓名" prop="name">
            </el-table-column>
            <el-table-column
            prop="info"   width="250" 
            label="关键信息">
            </el-table-column>
            <el-table-column   width="200" 
            prop="type"
            label="显示类型">
            </el-table-column>
            <el-table-column
            prop="list"
            label="人员列表">
            </el-table-column>
            
            <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
            
                <template >
                    <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)" title="修改" >修改
                    </el-button>
                </template>
                

                <template>
                <el-button
                size="small"
                @click="handleDelete(scope.$index, scope.row)" title="删除"  type="danger" :plain="true">删除
                </el-button>
                </template>
            </template>
            </el-table-column>
        </el-table>
      
        </template>
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
  import types from '../../store/mutation-types'
  import {mapGetters, mapActions, mapMutations} from 'vuex'  
  //console.log('autList',contolAuth())
  import qs from 'qs'
    export default{
        data(){
            return{
                contolAuth:contolAuth(),
                currentRow: {},
                dialogVisible: false,
                dialogLoading: false,
                tableHeadStyle:setTableHeadStyle,
                tableRowClassName:'',
                listLoading:false,
                tableData:{
                  rows:[{
                      id:0,
                      name:'尹鹏孝',
                      info:'123，456，789',
                      type:'公开，但是以下人员不展示',
                      list:'张总，冯总，周总，胡总，习总'
                  }]
             }
            }
            
        },
         computed: {
        ...mapGetters({
            currentMenus:'currentMenus',
        }),

        },
        methods:{
           
            handleSelectionChange(){

            },
            handleDelete(row){
                this.$confirm(deleteTipsObj.tips, deleteTipsObj.title,{
                    confirmButtonText: deleteTipsObj.confrimBtnText,
                    cancelButtonText: deleteTipsObj.cancelBtnText,
                    type:'waring'
                }).then(() => {
                let datas = {
                    "Id":row.id
                }
                // this.$http.post(api.SYS_ROLE_DEL,datas).then(res => {
                //     if(!res){
                //         this.logOff()
                //         return false;
                //     }
                //     this.loadData();
                //     this.$message({
                //         type: 'success',
                //         message: deleteTipsObj.success
                //     });
                // });
                
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: deleteTipsObj.cancel
                });          
                });
            },
            handleEdit(row){
                console.log(row);
                this.$router.push({
                    path:'contactsAdd',
                    query: {id: row}
                })
            }

        },
         components: {
      'imp-panel': panel
    },
       
    }
</script>
<style scoped>

</style>
