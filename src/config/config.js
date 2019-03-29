//上传文件https://doc.yuechenggroup.com

//接口https://portal.yuechenggroup.com

export const HOST = 'http://jujia01.ycsenior.com:5005';
export const HOSTUPLOAD = 'http://jujia01.ycsenior.com:5007';
//上传文件限制：
export const uploadUrl = HOSTUPLOAD+'/api/file/uploadone'

// export const HOST = 'https://portal.yuechenggroup.com';
// export const HOSTUPLOAD = 'https://doc.yuechenggroup.com';
// export const uploadUrl = HOSTUPLOAD+'/api/file/uploadone';




export const ROLESANDUSERS = HOST

export const route = "api"
export const Authorization = "Authorization"
export const services = "services"
export const WorkBench = "WorkBench"
export const UploadFiles = "UploadFiles"
export const Attendance = "Attendance"

export const Org = "Org"

export const headers = {
        headers: {
          "content-type":"application/json",
          //'Authorization': 'Bearer '+ Authorization
        }
}

export const headerAppX = {
  headers: {
  "content-type":"application/x-www-form-urlencoded"
  }
}

export const headerTextXml = {
  headers: {
  "content-type":"text/xml"
  }
}

export const headerMuFormDa = {
  headers: {
  "content-type":"multipart/form-data"
  }
}


 //          "content-type":"application/x-www-form-urlencoded"
                //         //'content-type':'application/json;'
                //         //'content-type':'multipart/form-data'
                //         //'content-type':'text/xml'


export const maxLength = 50
export const maxLength20 = 20

export const maxLengthUrl = 500

//客户端类型
export let clientType =[
  {
    label:'请选择客户端类型',
    value:0
  },
{
  label:'全部',
  value:3
},{
  label:'移动端',
  value:1
},{
  label:'pc端',
  value:2
}]

//是否启用
export const activeList = [{
  value:null,
  label:'请选择是否启用'
},{
    value:1,
    label:'是'
},{
  value:0,
  label:'否'
}]

//是否显示
export const defaultList = [{
  value:null,
  label:'请选择公开显示'
},{
    value:1,
    label:'是'
},{
  value:0,
  label:'否'
}]



export const isLt2M = 2;
export const isLt10M = 10;
export const isLt20M = 20;
export const limitFilesType = {
      png:'png',
      jpg:'jpg',
      jpeg:'jpeg',
      doc:'doc',
      docx:'docx',
      xls:'xls',
      xlsx:'xlsx',
      ppt:'ppt',
      pptx:'pptx',
      pdf:'pdf',
      html:'html'
}
export const limitFilesTypeText = 'png、jpg、jpeg、doc、docx、xls、xlsx、ppt、pptx、pdf、html'
export const limitImgTypeText = 'png、jpg、jpeg'

//分页的页面数量每页显示条数
export const pageSize={
        ten:10,
        twenty:20,
        Thirty:30
}

//删除提示
export const deleteTipsObj ={
  title:"提示",
  tips: "确认删除吗?",
  success:"删除成功!",
  cancel:"已取消删除",
  confrimBtnText:"确定",
  cancelBtnText:"取消"
}

//选择中英文切换
export const langugeList = [{
  name:"English",
  shortName:"en",
  id:0,
},
{
  name:"简体中文",
  shortName:"cn",
  id:1,
}
];


export const selectedLanguge={
name:"简体中文",
id:1,
shortName:"cn"
}

//通讯录列表内容
export const contactsList=[
  {
  value:0,
  label:'手机号'
  },
  {
      value:1,
      label:'手机号+职务级别'
  },
  {
      value:2,
      label:'职务级别'
  }
]

export const contactsShowStyle=[
{
  value:0,
  label:'公开，但以下人员不公开'
  },
  {
      value:1,
      label:'隐藏，但以下人员公开'
  },
  {
      value:2,
      label:'公开，但以下人员不公开'
  }
]

//消息管理中的消息类型列表
export const messageManagerList = [ {
  id:0,
  name:'老用户'
},
{
  id:1,
  name:'全部新用户'
},
{
  id:2,
  name:'集团新用户'
},
{
  id:3,
  name:'BCIS新用户'
}];


