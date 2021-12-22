/*
 * @Author: Rock Chang
 * @Date: 2021-08-11 20:02:42
 * @LastEditTime: 2021-12-22 16:35:19
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
export const ERR_CODE = {
  // 0-100 常用信息
  0: '操作成功',
  2: '操作失败',
  3: '参数错误',
  4: '授权失败',
  5: '权限不足, 禁止访问',
  6: '缺少查询条件',

  // 1000-1499 用户相关
  1000: '获取用户信息失败, 请尝试重新登陆',
  1001: '权限不足, 无法查看对方信息',
  1002: '登录成功',
  1003: '密码有误!',
  1004: '该账号未注册!',
  1005: '此账号已注册!',
  1006: '昵称已存在!',

  // 1500-1599 文件相关
  1500: '上传失败',
  1501: '请传入文件',

  // 4000-4999 权限相关
  4000: '令牌过期',
  4001: '令牌失效或损坏',
  4003: '令牌更新成功',
  4004: '令牌获取失败',
  4005: '请使用正确类型的令牌',
  4006: '请使用正确作用域的令牌',
  4010: 'access token 过期',
  4011: 'access token 损坏',
  4020: 'refresh token 过期',
  4021: 'refresh token 损坏',
  4100: '验证码发送成功',
  4101: '验证码发送失败',
  4102: '验证码校验成功',
  4103: '验证码校验失败',
  4105: '验证码失效, 请重新获取',
};
