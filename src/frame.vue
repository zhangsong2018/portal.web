<template>
  <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
    <router-view></router-view>
  </transition>
</template>

<script>
  import "font-awesome/css/font-awesome.css";
  export default{
      name:'frame'
  }
</script>
