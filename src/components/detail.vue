 <template>

          <el-form  label-width="180px" v-if="formDetal">
                <el-form-item label="名称">
                    {{formDetal.name}}
                </el-form-item>
                <el-form-item label="区域">
                    {{formDetal.sectionName}}
                </el-form-item>
                <el-form-item label="英文名称">
                    {{formDetal.enName}}
                </el-form-item>
                 <el-form-item label="所属区域英文名">
                    {{formDetal.enSectionName}}
                </el-form-item>
                <el-form-item label="图标">
                       <img :src="formDetal.iconUrl"  class="icon-imgs-pre">
                  
                </el-form-item>
                <el-form-item label="排序号">
                    {{formDetal.orderIndex}}
                </el-form-item>
                <el-form-item label="公开显示">
                     <template v-if='formDetal.isDefault'>是</template>
                     <template v-else>
                         否
                     </template>
                </el-form-item>
                <el-form-item label="移动端跳转链接">
                     <el-input :value="formDetal.mobileUrl" size="small" disabled class="input-width-80p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.mobileUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                <el-form-item label="BCIS移动端跳转链接">
                    <el-input :value="formDetal.bCISMobileUrl"  size="small"  disabled class="input-width-80p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.bCISMobileUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                 <el-form-item label="MAC跳转链接">
                     <el-input :value="formDetal.macUrl"  size="small"  disabled class="input-width-80p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.macUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                 <el-form-item label="WIN跳转链接">
                     <el-input :value="formDetal.winUrl"  size="small"  disabled class="input-width-80p">
                         <!-- <el-button slot="append" type='primary'  size="small" @click="download(form.id,form.winUrl)">下载</el-button> -->
                     </el-input>
                </el-form-item>
                 <el-form-item label="是否启用">
                    <template v-if='formDetal.isActive'>是</template>
                     <template v-else>
                         否
                     </template>
                </el-form-item>
                 <el-form-item label="类型">
                    <template slot-scope="scope" v-if="formDetal.clientType===1">移动端</template>
                    <template slot-scope="scope" v-if="formDetal.clientType===2">pc端</template>
                    <template slot-scope="scope" v-if="formDetal.clientType===3">全部</template>
                </el-form-item>
                
                 <el-form-item label="意图名">
                   {{formDetal.intent}}
                </el-form-item>
                 <el-form-item label="模板名">
                  {{formDetal.template}}
                </el-form-item>
                 <el-form-item label="备注">
                  {{formDetal.memo}}
                </el-form-item>
                {{goIstrue}}
                <div  style="margin-left: 180px;" v-if="goIstrue">
                     <el-button size="small" @click="returnPre" type="primary">返回</el-button>
                </div>
          </el-form>
          <!-- <el-row>
              <el-col class="el-form-item__label">
                 
              </el-col>
          </el-row> -->
      </template>
<script>

  import * as api from "../api"
  import {headers,maxLength,clientType,UploadFiles,uploadUrl,HOSTUPLOAD} from '../config/config'
  import {stringIsNull,stringTrimeFn,getImgURL} from '../utils/utils'
      export default {
          props:{
              myId:{
                  type:Number,
                  default:0
              },
              goIstrue:{
                  type:Boolean,
                  default:false
              }
          },
          data(){
              return {
                  formDetal:{}
              }
          },
        created() {
            console.log(147)
           
            this.loadingDatas();
           
            
        },
        mounted() {
            
        },
        methods:{
            loadingDatas(){
                    console.log(this.myId)
                    this.$http.post(api.SYS_WORK_BENCH_QUERY,{
                        Id:this.myId
                    },headers).then((res) => {
                    if(!res){
                    this.logOff()
                    return false;
                    }
                    if(res.data.success){
                        //图片路径处理
                        let url = res.data.result.workBenchList[0].iconUrl;
                        res.data.result.workBenchList[0].iconUrl = getImgURL(HOSTUPLOAD,UploadFiles,url);

                        this.formDetal = res.data.result.workBenchList[0];
                        console.log(this.formDetal)
                    }else{
                    this.$message.error(res.data.error);
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            },
        },

      }
      </script>
      <style scoped>
        .el-form-item{
            margin-bottom: 0;
        }
      </style>
      