export default {
  randomString:function(len,radix){
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },
  getUid:function(){
    var uid = window.localStorage.getItem('imp-uuid');
    if (!uid) {
      uid = this.randomString(32);
      window.localStorage.setItem('imp-uuid',uid);
    }
    return uid;
  },
  getSid:function(){
    var sid = window.localStorage.getItem('imp-sid');
    if(!!sid){
      return sid;
    }
    return '';
  },

  bearerToken:function(){
    var token = window.localStorage.getItem("token");
    if(!!token){
      return token;
    }
    return '';
  },

  login (token, callback) {
    window.localStorage.setItem('imp-sid',token);
    if (callback) callback();
  },

  getToken () {
    return window.localStorage.getItem('imp-sid');
  },

  logout (cb) {
    window.localStorage.removeItem('imp-sid');
    window.localStorage.removeItem('userAuth');
    window.sessionStorage.removeItem('state.sidebar.collapsed');
    window.sessionStorage.removeItem('state.sidebar.show');
    window.sessionStorage.removeItem('user-info');
    //清除记录分页信息
    window.sessionStorage.removeItem('paginationes');
    console.log(cb);
    if (cb) {
      console.log(333);
      cb()
    }
  },
  loggedIn () {
    //console.log('查看登陆状态');
    //console.log(window.localStorage.getItem('imp-sid'))
    return !!window.localStorage.getItem('imp-sid');
  }
}
