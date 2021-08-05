/*
 * @Author: Peng zhang
 * @Date: 2021-02-25 21:37:02
 * @LastEditTime: 2021-05-19 17:32:34
 * @Description: 用户相关接口
 */

import Router from 'koa-router';
import { ErrorResponse, DataResponse, AuthFailed } from '@/core/http-exception';
import { generateToken } from '@/utils/util';
import { Auth } from '@/middlewares/auth';
import { PositiveIntValidator } from '@/app/validators/demo';
import { LoginValidator } from '@/app/validators/user';
import { User } from '@/app/models/user';

const router = new Router();
// 接口前缀
router.prefix(`/user`);

// 登陆
router.post('/login', async ctx => {
  const vs = await new LoginValidator().validate(ctx);
  const { email, password } = vs.get('body');
  const res = await new User().getUser(email, 'email');
  if (res.length) {
    if (password === res[0].password) {
      const token = generateToken({
        id: res[0].id,
        admin: Number(res[0].admin),
      });
      throw new DataResponse({ token }, '登陆成功');
    } else {
      throw new ErrorResponse('密码有误!');
    }
  } else {
    throw new ErrorResponse('该邮箱未注册!');
  }
});

// 获取当前登录用户信息
router.get('/getCurrentUser', new Auth().init, async (ctx: any) => {
  const user = ctx.user;
  const res = await new User().getUserById(user.id);
  throw new DataResponse(res);
});

// 获取指定用户信息
router.get('/getUser', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const id = vs.get('query.id');
  const res: any = await new User().getUserById(id); // 查询人
  const user = ctx.user; // 当前登录人
  if (user.admin < res.admin) {
    throw new AuthFailed('权限不足');
  } else {
    throw new DataResponse(res);
  }
});

module.exports = router;
