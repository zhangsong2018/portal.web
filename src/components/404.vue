<template>
  <div class="error-page">
    <div class="errorWarp">
      <div class="image">
        <!-- <img src="../../static/img/404_error.png"/> -->
        <i class=" fa fa-bolt font-size-100"></i>
      </div>
      <h2 class="title">哎呀，页面被外星人带走了！</h2>
      <h3 class="desc">WE COULDN'T FIND THIS PAGE</h3>
      <router-link to="/index" class="fa fa-reply backBtn" tag="span">去太空找找吧</router-link>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default{
  }
</script>
<style scoped>
html{
  background: #474747;
}
.font-size-100{
  font-size:80px;
 color: rgb(255, 208, 75);
}
  .error-page {
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .error-page .errorWarp {
    margin: 10% auto auto auto;
  }

  .error-page .errorWarp .image {
  }

  .error-page .errorWarp .title {
    color: #666;
    font-size: 36px;
    padding: 15px 30px;
    margin-bottom: 10px;
    margin-top: 20px;
    font-weight: bold;
  }

  .error-page .errorWarp .desc {
    font-size: 24px;
    color: #474747;
    font-weight: bold;
    line-height: 30px;
  }

  .error-page .errorWarp .backBtn {
    display: inline-block;
    color: rgb(255, 208, 75);;
    margin-bottom: 20px;
    margin-top: 50px;
    padding: 15px 30px;
    border: 1px solid rgb(255, 208, 75);;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
