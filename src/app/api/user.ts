/*
 * @Author: Peng zhang
 * @Date: 2021-02-25 21:37:02
 * @LastEditTime: 2021-08-12 10:00:21
 * @Description: 用户相关接口
 */

import Router from 'koa-router';
import {
  SuccessResponse,
  ErrorResponse,
  DataResponse,
  AuthFailed,
} from '@/core/http-exception';
import { Auth } from '@/middlewares/auth';
import { PositiveIntValidator } from '@/app/validators/demo';
import { LoginValidator, RegisterValidator } from '@/app/validators/user';
import { User } from '@/app/models/user';
import { jwt } from '@/utils/jwt';

const userModel = new User();
const router = new Router();
// 接口前缀
router.prefix(`/user`);

// 登陆
router.post('/login', async ctx => {
  const vs = await new LoginValidator().validate(ctx);
  const { account, password } = vs.get('body');
  const res = await userModel.getUser(account, ['email', 'phone']);
  if (res.length) {
    if (password === res[0].password) {
      const { accessToken: access_token, refreshToken: refresh_token } =
        jwt.getTokens({
          id: res[0].id,
          admin: Number(res[0].admin),
        });
      throw new DataResponse({ access_token, refresh_token }, '登录成功');
    } else {
      throw new ErrorResponse('密码有误!');
    }
  } else {
    throw new ErrorResponse('该账号未注册!');
  }
});

// 获取当前登录用户信息
router.get('/getCurrentUser', new Auth().init, async (ctx: any) => {
  const user = ctx.user;
  const res = await userModel.getUserById(user.id);
  throw new DataResponse(res);
});

// 获取指定用户信息
router.get('/getUser', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const id = vs.get('query.id');
  const res: any = await userModel.getUserById(id); // 查询人
  const user = ctx.user; // 当前登录人
  if (user.admin < res.admin) {
    throw new AuthFailed('权限不足, 无法查看对方信息', 4102);
  } else {
    throw new DataResponse(res);
  }
});

// 注册
router.post('/register', async ctx => {
  const vs = await new RegisterValidator().validate(ctx);
  const { name, email, password } = vs.get('body');
  // 判断是否注册过
  const registered = await userModel.getUser(email, 'email');
  if (registered.length) throw new ErrorResponse('此账号已注册!');
  // 昵称是否重复
  const named = await userModel.getUser(name, 'name');
  if (named.length) throw new ErrorResponse('昵称已存在!');
  // 插入数据
  await userModel.addUser({ name, email, password });
  throw new SuccessResponse();
});

//修改用户信息
router.post('/update', async ctx => {
  console.log('ctx', ctx);
  throw new DataResponse();
});

module.exports = router;
