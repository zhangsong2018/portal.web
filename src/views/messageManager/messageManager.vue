<template>

    <imp-panel>
            <!-- <el-row>
                <el-col>
                    <el-input placeholder="消息标题" v-model="messageTitle" size="small" ></el-input>
                    <el-date-picker  v-model="sendMessageDate"  type="datetime"   size="small" placeholder="请选择推送日期" format="yyyy-MM-dd-HH-mm-ss"></el-date-picker>
                    <el-select v-model="messageType"  placeholder="请选择消息类型"  size="small">
                        <el-option v-for="(item,index) in messageTypeList" :key="index" :value="item.id"  :label="item.name">

                        </el-option>
                    </el-select>
                     <el-button @click="search" type="primary"  size="small">搜索</el-button>
                 </el-col>
            </el-row> -->
            <el-row>
                <div>
                <el-col :span="12">
                    <span class="fa fa-list main-color">消息列表</span>
                </el-col>
                 <el-col :span="12">
                     <el-button   style="float:right" plain type="primary"  size="small" @click="settingMsg">群发消息</el-button>
                 </el-col>
                </div>
                <el-table :data="tableDate" border  stripe style="width: 100%;margin-top:40px;"  v-loading="listLoading"  :header-row-style="tableHeadStyle">
                    <el-table-column  label="消息内容" prop="content" style="width:200px;">
                        
                    </el-table-column>
                    <el-table-column prop="userType" label="用户类型">
                        
                    </el-table-column>
                    <el-table-column prop="isPub" label="发布状态">
                        
                    </el-table-column>
                     <el-table-column prop="time" label="发布时间">
                        
                    </el-table-column>
                    <el-table-column prop="admin" label="发布人员">
                        
                    </el-table-column>
                    <el-table-column  label="操作" width="360px;">
                          <template slot-scope="scope">
                                <el-button  size="mini" plain type="warning"  @click="publish(scope.$index,scope.row)" >发布</el-button>
                                <el-button  size="mini" plain  type="success"  @click="cancelPublish(scope.$index,scope.row)" >取消发布</el-button>
                                <el-button   size="mini" plain type="info"  @click="lookUp(scope.$index,scope.row)" >查看</el-button>
                                <el-button  size="mini" plain type="danger"  @click="delMsg(scope.$index,scope.row)" >删除</el-button>
                          </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.pageNo"
                    :page-sizes="[5, 10, 20]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
                </el-pagination>

                <el-dialog title="APP推送"  width="35%" class="min-width-600" center :visible="dialogShow" :before-close="dialogClose">

                    <el-form ref="form" :model="form"  :rules="rules" label-width="94px" class="demo-ruleForm">
                        <el-form-item label="用户类型："   prop="userType">
                            <el-radio v-model="form.userType" :label="item.id" v-for="item in messageTypeList" :key="item.id">{{item.name}}</el-radio>
                        </el-form-item>
                        <el-form-item label="推送用户："  prop="userList">
                            <el-input   placeholder="选择要推送的用户"  v-model="form.userList">
                                <template  slot="append" icon="el-icon-search">
                                    <el-button @click="settingUsers">查找</el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="链接：">
                            <el-input  placehoder="输入链接" v-model="form.link"></el-input>
                        </el-form-item>
                        <el-form-item label="推送内容："  prop="content">
                            <!-- <el-input type="textarea"  v-model="form.content"></el-input> -->
                             <div contenteditable="true" class="text-area-set" v-html="form.content" ref="formContents">
                             </div>
                            <div>内容不宜过长，建议不超过50个字。</div>
                        </el-form-item>
                        <el-form-item label="是否发布：">
                            <el-switch  v-model="form.isPub"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </el-form-item>
                         <el-form-item >
                               <el-button size="small" @click="cancel('form')">取消</el-button>
                                <el-button  size="small"  @click="confirm('form')" type="primary">确认</el-button>
                         </el-form-item>
                    </el-form>
                </el-dialog>

                    <el-dialog title="选择用户"  width="1024px" style="min-width:35%" center :visible="userMovementLoading" :before-close="userMovementClose">
                            <tree-table 
                            @getDatas="getTreeTableDatas"
                            :propOrgGuids="orgGuids"
                            :porpOrgRoleId="roleId"
                            :propTree="treeType"
                            :propPageNum="pangeNum"
                            :propPageTypes="pageTypes"
                            :propTableHeader="tableheader"
                            :propTWidth="tWidth"
                            :propBWidth="bWidth"
                            ></tree-table>
                    </el-dialog>
            </el-row>
    </imp-panel>
</template>
<script>
 import panel from "../../components/panel.vue"
 import {messageManagerList} from '../../config/config'
 import {setTableHeadStyle,contolAuth,timerFormat} from '../../utils/utils'
 import treeTable from '../../components/treeTable.vue'
export default {
     components: {
      'imp-panel': panel,
      'tree-table':treeTable
    },
    data(){
        return {
            listLoading:false,
            userMovementLoading:false,
            messageTitle:'',
            sendMessageDate:'',
            messageType:null,
            messageTypeList:messageManagerList,
            tableDate:[{
                content :'AAAAAAAAAAAAAA',
                userType:'',
                isPub:'',
                time:'',
                admin:'',
                id:0
            }],
            pagination:{
                pageNo:1,
                pageSize:0,
                total:0
            },
            //弹出窗
            dialogShow:false,
            //弹出窗表单
            form:{
                userType:0,
                userList:'',
                link:'',
                content:'',
                isPub:0,
            },
            //验证规则
             rules: {
                userType: [
                    { required: true, message: '请选择用户类型', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                userList: [
                    { required: true, message: '请选择要推送的用户', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请输入推送内容', trigger: 'change' }
                ],
            },
            //树表格
            orgGuids:['CFB51325-241A-4E61-BDFB-CFDCF1915513','627D81ED-1FB7-40D3-B623-85C4471B2EB8','BC1DD4BD-CFAE-443C-8131-A53C3DB03B53','5A828CB3-F608-40E2-98DD-A6241EE791E1','77E8A24E-34F3-4721-9786-7938483DC031','0C1299C4-9E25-44C7-9A60-BE2D2D04FBE2','6C3CCAC7-F044-4C3E-A8A5-6748B50D4E54','11DD0F90-E3A1-459C-B360-82E6D823AB6','6BA63B43-4C71-47E1-B7C8-A8B1F755AD09','58F815CF-F7FB-4E79-978B-03343B23E903','3047EECE-8BDC-48F0-94FA-E375EB8DFC8A','D5DF0881-AACD-4315-A7E9-B18445264ED6','0142CF3A-1186-44D0-B513-019BEA02FBFF','4862494B-3BA6-4EFD-AFA0-F94D00FE13B3','E0B1FE67-F02B-4C94-92C1-5EAFE3DA1D10','8AA076A6-7471-453D-9CF1-98FBDC74DBD4','33922FE5-99F5-4809-A203-C0FE78B92841','DEC41D11-9D27-4DB4-AB7F-93065492D150','383774DE-4A11-4187-907E-C7423A586A7C','19903D77-8962-45EF-AE39-F1DEAC7056FE','3963AC32-973F-4829-8B2D-59CB5A602090','0CF24716-4E06-4B41-9A72-5430A1011D20','764EAFD7-6774-47E6-AEF5-536502521B42','D0F0DB6C-1855-42B5-BB78-FDDA63823500','3A6E9F1A-423C-4D67-B9BA-2AEBF0C30B4D','2CC33A6D-E5EA-4F63-B9C4-C45CC660DA96','2977F619-3C38-49A1-A212-A9C9D787A78C','0869C1AC-E4D6-4D1A-B0E8-09B54B3C3239','C6AA5188-B31A-4E60-B965-4E4CD010384F','5475FD68-CE8F-4E51-9482-F6FF27B11030','02669819-74DF-413A-96DD-99470260D786','18E8F34F-DFA5-4FD8-BBB8-EAC92E533316','554B5411-EE72-4B69-9772-04B28F3865A2','37EB689E-33D3-4657-B5DD-98AC6A0D764A','F372B325-30CD-45A0-8E39-F4185F1EDFBF','7E9C3262-C781-43F4-9D56-8BAC92EA02F2','64BDB1BB-4A96-49E2-82C4-A8BE2509AB4E'],
            roleId:null,
            treeType:{
                children:'childOrgs',
                label:'chineseName',
              },
            pangeNum:10,
            pageTypes:[],
            tableheader:{},
            tWidth:'900px',
            bWidth:'600px'
        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
        search(){

        },
        settingMsg(){
            console.log(123456)
            this.dialogShow = true
        },
        publish(data){
             this.$confirm('确认发布？')
            .then(_ => {
                //this.dialogShow = false;
            })
            .catch(_ => {});
        },
        cancelPublish(data){
             this.$confirm('确认取消发布？')
            .then(_ => {
                //this.dialogShow = false;
            })
          .catch(_ => {});
        },
        lookUp(data){
            console.log(data);
            this.dialogShow = true;
        },
        delMsg(data){

            this.$confirm('确认删除？')
            .then(_ => {
                //this.dialogShow = false;
            })
          .catch(_ => {});
        },
        //分页
        handleSizeChange(){

        },
        handleCurrentChange(){

        },
        //人员设置
        settingUsers(){
            this.userMovementLoading = true;
        },
        //表单提交和取消
        confirm(formName) {
           
            this.$refs[formName].validate((valid) => {
                console.log(valid)
            if (valid) {

                alert('submit!');
            } else {
                return false;
            }
             this.dialogShow = false;
            });
      },
      cancel(formName) {
        this.dialogShow = false;
        this.$refs[formName].resetFields();
      },
      dialogClose(done){
       this.$confirm('确认关闭？')
          .then(_ => {
            done();
             this.dialogShow = false;
          })
          .catch(_ => {});
      },
      tableHeadStyle(){
        return setTableHeadStyle()
      },
      //选择用户
      userMovementClose(){
          this.userMovementLoading=false;
      },
      //表格树提交
      getTreeTableDatas(val){
          console.log(val);
          this.userMovementLoading=false;
      }
    },
    watch:{
        
    },
    computed:{

    }
}
</script>
<style>
.text-area-set{
    line-height: 1.5;
    font-size: 14px;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 8px;
    overflow-y: scroll;
}
.min-width-600 .el-dialog{
    min-width: 600px;
}
</style>

