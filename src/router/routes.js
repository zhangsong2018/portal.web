
//import NotFoundView from "../components/404";
// import menuList from "../pages/sys/menu.vue";
//import role from "../views/role/role";
// import roleList from "../views/roleList/roleList";
// import roleAdd from "../views/roleAdd/roleAdd";
// // import resource from "../pages/sys/resource.vue";
// import login from "../views/login/login";
// import app from "../App.vue";
// import index from '../views/index/index'
// import test from '../views/test/test'
// import sysUser from "../pages/sys/user.vue";
// import userAdd from "../pages/sys/userAdd.vue";
// import resetPwd from "../pages/resetPwd.vue";
// Routes
//报表

const NotFoundView = (resolve)=>{
  import('../components/404').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const role = (resolve)=>{
  import('../views/role/role').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const roleList = (resolve)=>{
  import('../views/roleList/roleList').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const uploadReport = (resolve)=>{
  import('../views/uploadReport/uploadReport').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const roleAdd = (resolve)=>{
  import('../views/roleAdd/roleAdd').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const login = (resolve)=>{
  import('../views/login/login').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const app = (resolve)=>{
  import('../App.vue').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const index = (resolve)=>{
  import('../views/index/index').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const test = (resolve)=>{
  import('../views/test/test').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const reportManagemantList = (resolve)=>{
  import('../views/reportManagemantList/reportManagemantList').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const reportManagemantType = (resolve)=>{
  import('../views/reportManagemantList/reportManagemantType').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const reportManagemantAdd = (resolve)=>{
  import('../views/reportManagemantAdd/reportManagemantAdd').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const reportManagemantEdit = (resolve)=>{
  import('../views/reportManagemantAdd/reportManagemantEdit').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const reportManangementDetail=(resolve)=>{
  import('../views/reportManangementDetail/reportManangementDetail').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}


const instAndPowerDivce = (resolve)=>{
  import('../views/instAndPowerDivce/instAndPowerDivce').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const roleAndPowerDivce=(resolve)=>{
  import('../views/roleAndPowerDivce/roleAndPowerDivce').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const workAndDerictiveList=(resolve)=>{
  import('../views/workAndDerictiveList/workAndDerictiveList').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const workAndDerictiveAdd=(resolve)=>{
  import('../views/workAndDerictiveAdd/workAndDerictiveAdd').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}
const workAndDericetiveDetail=(resolve)=>{
  import('../views/workAndDericetiveDetail/workAndDericetiveDetail').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err)
  })
}

const setSystemPermissions=(resolve)=>{
  import('../views/setSystemPermissions/setSystemPermissions').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}

const setWorkAndDerictivePermissions=(resolve)=>{
  import('../views/setWorkAndDerictivePermissions/setWorkAndDerictivePermissions').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}

const setRolesAndUsers = (resolve)=>{
  import('../views/setRolesAndUsers/setRolesAndUsers').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}

const autoLogin = (resolve)=>{
  import('../views/autoLogin/autoLogin').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}

//创建联系人
const contactsAdd = (resolve)=>{
  import('../views/contacts/contactsAdd').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}

// const contactsList = (resolve)=>{
//   import('../views/contacts/contactsList').then((module)=>{
//     resolve(module)
//   }).catch((err)=>{
//     console.log(err);
//   })
// }



//设置加班管理
const overtimeLog = (resolve)=>{
  import('../views/overtimeLog/overtimeLog').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}

//组织架构管理
//设置hr表格
// const organizational = (resolve)=>{
//   import('../views/organizational/organizational').then((module)=>{
//     resolve(module)
//   }).catch((err)=>{
//     console.log(err);
//   })
// }

//消息管理
// const messageManager = (resolve)=>{
//   import('../views/messageManager/messageManager').then((module)=>{
//     resolve(module)
//   }).catch((err)=>{
//     console.log(err);
//   })
// }

//消息管理
const treeTable = (resolve)=>{
  import('../components/treeTable').then((module)=>{
    resolve(module)
  }).catch((err)=>{
    console.log(err);
  })
}


const routes = [
  {
    path: '/login', component: login,
    // meta: {
    //   title: '登陆',
    //   requireAuth: true
    // }

  },
  {
    path: '/test', component: test, children: [
    {path: '*', component: NotFoundView}
  ]
  },
  //授权登陆
  {
    path:'/autoLogin',component:autoLogin
  },
  //treeTablePage
  {
    path:'/treeTable',component:treeTable
  },
  {
    path: '',
    component: app,
    children: [
        //欢迎首页
        {
          path: '/index', component: index
        },
        //角色设置页面
        {path: '/sys/roleList', component: roleList},
         //上传报表
        {path: '/sys/uploadReport', component: uploadReport},
        //通讯录
        // {
        //   path:'/sys/contactsList',component:contactsList
        // },
        {
          path:'/sys/contactsAdd',component:contactsAdd
        },
        //角色和数据绑定页面
        {path: '/sys/role', component: role},
        //新增角色
        {path: '/sys/roleAdd', component: roleAdd},
        //机构和用户权限分配
        {
          path:'/sys/instAndPowerDivce',component:instAndPowerDivce
        },

        {
          path:'/sys/roleAndPowerDivce',component:roleAndPowerDivce
        },
        //工作台和指令管理列表
        {
          path:'/sys/workAndDerictiveList',component:workAndDerictiveList
        },
        //工作台和指令管理新增和编辑
        {
          path:'/sys/workAndDerictiveAdd',component:workAndDerictiveAdd
        },
        //工作台指令详情
        {
          path:'/sys/workAndDericetiveDetail',component:workAndDericetiveDetail
        },

          //报表管理(报表列表)
        {
          path:'/sys/reportManagemantList', component:reportManagemantList
        },
        {
          path:'/sys/reportManagemantType', component:reportManagemantType
        },
        //报表新增
        {
          path:'/sys/reportManagemantAdd', component:reportManagemantAdd
        },
        //报表审批
        {
          path:'/sys/reportManagemantEdit', component:reportManagemantEdit
        },
        //报表详情
        {
          path:'/sys/reportManangementDetail',component:reportManangementDetail
        },

        //系统权限
        {
          path:'/sys/setSystemPermissions',component:setSystemPermissions
        },
        {
          path:'/sys/setWorkAndDerictivePermissions',component:setWorkAndDerictivePermissions
        },
        {
          path:'/sys/setRolesAndUsers',component:setRolesAndUsers
        },
         //加班管理
        {
          path:'/sys/overtimeLog',component:overtimeLog
        },
        // {
        //   path:'/sys/organizational',component:organizational
        // },
        //消息管理
        // {
        //   path:'/sys/messageManager',component:messageManager
        // },

      ],
    meta: {
      title: '首页',
      requireAuth: true
    },
  },
  {path: '*', component: NotFoundView}
]


export default routes

