<template>
    <imp-panel :title="form.id ? '工作台详情':'工作台详情'">
    <!-- <div slot="body"> -->
      <template v-if="form.id">
          <el-form  label-width="180px">
                <el-form-item label="名称">
                    {{form.name}}
                </el-form-item>
                <el-form-item label="区域">
                    {{form.sectionName}}
                </el-form-item>
                <el-form-item label="英文名称">
                    {{form.enName}}
                </el-form-item>
                 <el-form-item label="所属区域英文名">
                    {{form.enSectionName}}
                </el-form-item>
                <el-form-item label="图标">
                        <template v-if="!!form.iconUrl">
                            <img :src="form.iconUrl"  class="icon-imgs-pre">
                        </template>
                        <template>
                                
                        </template>
                       
                  
                </el-form-item>
                <el-form-item label="排序号">
                    {{form.orderIndex}}
                </el-form-item>
                <el-form-item label="公开显示">
                     <template v-if='form.isDefault'>是</template>
                     <template v-else>
                         否
                     </template>
                </el-form-item>
                <el-form-item label="移动端跳转链接">
                     <el-input :value="form.mobileUrl" size="small" disabled class="input-width-50p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.mobileUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                <el-form-item label="BCIS移动端跳转链接">
                    <el-input :value="form.bcisMobileUrl"  size="small"  disabled class="input-width-50p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.bcisMobileUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                 <el-form-item label="MAC跳转链接">
                     <el-input :value="form.macUrl"  size="small"  disabled class="input-width-50p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.macUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                 <el-form-item label="WIN跳转链接">
                     <el-input :value="form.winUrl"  size="small"  disabled class="input-width-50p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.winUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                 <el-form-item label="是否启用">
                    <template v-if='form.isActive'>是</template>
                     <template v-else>
                         否
                     </template>
                </el-form-item>
                 <el-form-item label="类型">
                    <template slot-scope="scope" v-if="form.clientType===1">移动端</template>
                    <template slot-scope="scope" v-if="form.clientType===2">pc端</template>
                    <template slot-scope="scope" v-if="form.clientType===3">全部</template>
                </el-form-item>
                
                 <el-form-item label="意图名">
                   {{form.intent}}
                </el-form-item>
                 <el-form-item label="模板名">
                  {{form.template}}
                </el-form-item>
                 <el-form-item label="备注">
                  {{form.memo}}
                </el-form-item>
                <div  style="margin-left: 180px;">
                     <el-button size="small" @click="returnPre">返回</el-button>
                </div>
          </el-form>
          <!-- <el-row>
              <el-col class="el-form-item__label">
                 
              </el-col>
          </el-row> -->
      </template>
    <!-- </div> -->
  </imp-panel>
</template>
<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import {headers,maxLength,clientType,UploadFiles,uploadUrl,HOSTUPLOAD} from '../../config/config'
  import {stringIsNull,stringTrimeFn,getImgURL} from '../../utils/utils'
export default {
    components:{ 'imp-panel': panel,},
    data(){
        return { 
        listLoading: false,
        searchKey: '',
        clientTypeList:clientType,
        form:{
            id:null
        },
        }
    },
    created(){
        this.loadingDatas();
    },
    mounted(){
        
    },
    methods:{
        loadingDatas(){
        let datas = this.form
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
            this.form.id = this.$route.query.id;
            console.log(this.form.id)
            this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                Id:this.form.id
            },headers).then((res) => {
            if(!res){
              this.logOff()
              return false;
            }
            if(res.data.success){
                //图片路径处理
                let url = res.data.result.workBenchList[0].iconUrl;
               res.data.result.workBenchList[0].iconUrl = getImgURL(HOSTUPLOAD,UploadFiles,url);
               this.form = res.data.result.workBenchList[0];
            }else{
              this.$message.error(res.data.error);
            }
          }).catch((err)=>{
            console.log(err)
          })
        }
        },
        download(){
            
        },
        returnPre(){
            // this.$router.push({
            //     path:'workAndDerictiveList'
            // })

            window.history.go(-1)
        }
    }
}
</script>
<style scoped>
.el-form-item {
    margin-bottom: 0px;
}
</style>


