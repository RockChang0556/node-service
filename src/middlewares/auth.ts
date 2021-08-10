/*
 * @Author: Rock Chang
 * @Date: 2021-04-29 10:28:10
 * @LastEditTime: 2021-08-10 15:07:34
 * @Description: 权限控制中间件
 */
import jwt from 'jsonwebtoken';
import { Forbidden, AuthFailed } from '@/core/http-exception';
import { JWT } from '@/constant/config';

class Auth {
  admin: number;
  constructor(admin?: number) {
    this.admin = admin || 0;
  }
  get init() {
    return async (ctx, next) => {
      const authorization: string | undefined =
        ctx.request.header && ctx.request.header.authorization.split(' ')[1];
      // 1. 判断是否有token
      if (!authorization) {
        throw new Forbidden('token获取失败', 4004);
      }
      // 2. 判断token是否有效
      /* 
        decode = {
          id: [number] 用户id, 
          admin: [number] 用户权限级别, 0为普通用户, 1~5管理员级别递增
        } 
      */
      let decode = null;
      try {
        decode = jwt.verify(authorization, JWT.SECRET_KEY);
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new Forbidden('token已过期, 请重新登录', 4005);
        }
        throw new Forbidden('token不合法, 请重新登录', 4006);
      }
      // 3. 判断token是否有权限访问接口:  用户权限级别 < 当前接口所需权限级别
      if (decode.admin < this.admin) {
        throw new AuthFailed('权限不足', 4001);
      }
      ctx.user = decode;
      await next();
    };
  }
}

export { Auth };
