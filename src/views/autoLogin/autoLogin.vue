<template>
    <div>
        跳转登陆： SYS_USER_SYSTEM_PERMISSIONS
    </div>
</template>
<script>
import *as api from '../../api'
export default {
    data(){
        return {

        }
    },
    created(){
       this.loading();
    },
    methods:{
        loading(){
            //http://jujia01.ycsenior.com:5005
            
            //this.$http.post(api.SYS_USER_SYSTEM_PERMISSIONS,).then((res)=>{
            //     this.$http.post('http://jujia01.ycsenior.com:5005/api/Authorization/UserSystemPermissions').then((res)=>{
            // console.log(res);
            // }).catch((err)=>{
            //     console.log(err);
            // })
        }
    }
}
</script>

