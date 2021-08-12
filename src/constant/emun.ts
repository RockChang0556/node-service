/*
 * @Author: Rock Chang
 * @Date: 2021-08-11 20:02:42
 * @LastEditTime: 2021-08-11 20:08:20
 * @Description: 枚举
 */

// 用户对应权限码 userInfo.admin
export enum ADMIN {
  SUPER = 5, // 超管
  DELETE = 3, // 管理员-可删除
  EDIT = 2, // 管理员-可编辑
  READ = 1, // 管理员-可查看
  VISITOR = 0, //访客
}
