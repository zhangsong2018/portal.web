<template>
  <footer class="main-footer">
    Copyright &copy; {{staticDatas.time}} <a :href="staticDatas.link">{{staticDatasWebSite}}</a>. All rights reserved.
  </footer>
</template>
<script>
  import {staticDatas} from '../../lang/static_datas'
  export default {
    data(){
      return {
        staticDatas:staticDatas.footer,
        staticDatasWebSite:staticDatas.websiteNameText
      }
    }
  }
</script>
<style scoped>
  .main-footer {
    -webkit-transition: -webkit-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -moz-transition: -moz-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    -o-transition: -o-transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    text-align: center;
    padding: 5px 15px;
    color: #444;
    width: 100%;
  }
</style>
