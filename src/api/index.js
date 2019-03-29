// export const CONTEXT = './api';
import {route,Authorization,services,WorkBench,Org,Attendance} from '../config/config'
export const CONTEXT = route;

//export const LOGIN = CONTEXT + '/login';
//api/Authorization/UserSystemPermissions
//export const LOGIN = CONTEXT + '/Authorization/UserSystemPermissions';
//export const LOGIN = '/connect/token';
export const LOGIN = CONTEXT + '/Login/RequestLoginToken'

export const LOGOUT = CONTEXT + '/logout';
export const CHANGE_PWD = CONTEXT + '/changePwd';

export const SYS_ROLE_DELETE = CONTEXT + '/sys/role/delete';

export const SYS_USER_GET = CONTEXT + '/sys/user/get';
export const SYS_USER_ADD = CONTEXT + '/sys/user/add';
export const SYS_USER_UPDATE = CONTEXT + '/sys/user/update';
export const SYS_USER_DELETE = CONTEXT + '/sys/user/delete';
export const SYS_USER_PAGE = CONTEXT + '/sys/user/page';
export const SYS_USER_ROLE = CONTEXT + '/sys/user/roleIds';
export const SYS_SET_USER_ROLE = CONTEXT + '/sys/user/setRoles';

//系统权限获取
export const SYS_MENU_LIST = CONTEXT + '/'+Authorization+'/'+'SystemPermissions';
//获取全部组织机构
export const MSG_TOP_TEN =  CONTEXT + '/'+Org+'/'+'OrgStruct';
//报表管理
export const SYS_REPORT_MANAGEMENT = CONTEXT +'/report/management'
//报表详情
export const SYS_REPORT_DETAILS = CONTEXT +'/report/details'
//下载报表
export const SYS_REPORT_DOWNLOAD = CONTEXT +'/report/downloads'
//角色管理列表
export const SYS_ROLE_LIST =  CONTEXT +'/'+ Authorization+'/'+'RoleQuery';
//新增角色
//export const SYS_ROLE = CONTEXT +'/services/app/Role/RoleSave'
export const SYS_ROLE =  CONTEXT +'/'+ Authorization+'/'+'RoleSave'
//删除角色
export const SYS_ROLE_DEL = CONTEXT +'/'+ Authorization+'/'+'RoleDelete'

//工作台和指令
//工作台指令查询
export const SYS_WORK_BENCH_QUERY = CONTEXT +'/'+ WorkBench+'/'+'WorkBenchQuery'
//删除工作台指令
export const SYS_WORK_BENCH_QUERY_DEL = CONTEXT +'/'+ WorkBench+'/'+'WorkBenchDelete'
//创建更新工作台指令
export const SYS_WORK_BENCH_QUERY_ADD_EDIT = CONTEXT+'/'+ WorkBench+'/'+'WorkBenchSave'
//机构用户权限分配这个不用修改
export const SYS_INST_ANS_POWER_DIVCE = CONTEXT + '/'+Org+'/'+'OrgStruct';
//获取系统权限设置后保存
export const SYS_SET_SYSTEM_PERMISSION_SAVE = CONTEXT +'/'+ Authorization+'/'+'RolePermissionSave';
//角色工作台权限
export const SYS_WORK_AND_DERICCTIVE_PERMISSIONS = CONTEXT +'/'+ Authorization+'/'+'RoleWorkBenchSave';
//角色用户获取
export const SYS_ROLES_AND_USERS = CONTEXT+'/org/OrgStaffs';
//用户角色保存
export const SYS_ROLES_AND_USERS_SAVE = CONTEXT+'/'+Authorization+'/'+'UserRoleSave'
//用户权限接口
export const SYS_USER_SYSTEM_PERMISSIONS = CONTEXT+'/'+Authorization+'/'+'UserSystemPermissions'

//加班日志查询
export const SYS_ATTENDANCE_OVERTIMELOG  = CONTEXT+'/'+Attendance+'/'+'OverTimeLog'


