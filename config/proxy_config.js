module.exports = {
    proxy: {
          '/api': {    //将www.exaple.com印射为/api
              target: 'http://jujia01.ycsenior.com:5005',  // 接口域名
              secure: false,  // 如果是https接口，需要配置这个参数
              changeOrigin: true,  //是否跨域
            //   pathRewrite: {
            //       '^/api': ''   //需要rewrite的,
            //   }              
          },
          '/connect':{
            target: 'http://192.168.0.150:5000',  // 接口域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true,  //是否跨域
          }
    }
  }