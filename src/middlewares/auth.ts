/*
 * @Author: Rock Chang
 * @Date: 2021-04-29 10:28:10
 * @LastEditTime: 2021-08-11 19:23:47
 * @Description: 权限控制中间件
 */
import { AuthFailed } from '@/core/http-exception';
import { jwt } from '@/utils/jwt';

class Auth {
  admin: number;
  constructor(admin?: number) {
    this.admin = admin || 0;
  }
  get init() {
    return async (ctx, next) => {
      // 1. access_token 验证
      const { data: decode } = jwt.parseHeader(ctx);
      // 2. 判断token是否有权限访问接口:  用户权限级别 < 当前接口所需权限级别
      if (decode.admin < this.admin) {
        throw new AuthFailed('权限不足', 4101);
      }
      ctx.user = decode;
      await next();
    };
  }
}

export { Auth };
