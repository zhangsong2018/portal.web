/* eslint-disable */ 

<template>
  <el-submenu :index="item.href" v-if="item.children && item.children.length>0" class="el-menu-sub">

    <template slot="title">
      <i :class="item.icon"></i><span>{{item.displayName}}</span>
    </template>
    <template v-for="(child,i) in item.children">
      <sub-menu  :param='child' v-if='child.children && child.children.length > 0'  :key="i"></sub-menu>
      <el-menu-item :index='child.href'  :key="i" v-else> 
        <i :class='child.icon'></i> 
        <span>{{child.displayName}}</span>
      </el-menu-item>
    </template>
  </el-submenu>
  <el-menu-item :index="item.href" v-else class="el-menu-each">
    <i :class="item.icon"></i><span>{{item.displayName}}</span>
  </el-menu-item>
</template>

<!--
<template>
  <el-submenu :index="item.href" v-if="item.children && item.children.length>0" class="el-menu-sub">

    <template slot="title">
      <i :class="item.icon"></i><span>{{item.name}}</span>
    </template>
    <template v-for="(child,i) in item.children">
      <sub-menu  :param='child' v-if='child.children && child.children.length > 0'  :key="i"></sub-menu>
      <el-menu-item :index='child.href'  :key="i" v-else> 
        <i :class='child.icon'></i> 
        <span>{{child.name}}</span>
      </el-menu-item>
    </template>
  </el-submenu>
  <el-menu-item :index="item.href" v-else class="el-menu-each">
    <i :class="item.icon"></i><span>{{item.name}}</span>
  </el-menu-item>
</template>
-->
<script>
  import subMenu from "./subMenu.vue"

  export default {
    name: 'subMenu',
    props: ['param'],
    data: function () {
      return {item: this.param}
    },
    components: {
      subMenu
    }
  }
</script>
<style scoped>
  .el-menu .fa {
    margin-right: 10px;
  }
 
</style>
