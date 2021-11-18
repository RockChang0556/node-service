/*
 * @Author: Peng zhang
 * @Date: 2021-02-25 21:37:02
 * @LastEditTime: 2021-11-18 23:44:47
 * @Description: 用户相关接口
 */

import Router from 'koa-router';
import {
  SuccessResponse,
  ErrorResponse,
  DataResponse,
  AuthFailed,
  ParamsErr,
} from '@/core/http-exception';
import { Auth } from '@/middlewares/auth';
import { Validator } from '@/app/validators/demo';
import {
  LoginValidator,
  RegisterValidator,
  EmailValidator,
  EmailCodeValidator,
  UpdatePasswordValidator,
  GetUserValidator,
} from '@/app/validators/user';
import { userModels, formatUser } from '@/app/models/user';
import { jwt, TokenType } from '@/utils/jwt';
import { emailUtils } from '@/utils/email';
import { ADMIN } from '@/constant/emun';
import { API } from '@/constant/config';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/user`);

// 登陆
router.post('/login', async ctx => {
  const vs = await new LoginValidator().validate(ctx);
  const { account, password } = vs.get('body');
  const res = await userModels.getUser(account, ['email', 'phone']);
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

// 更新令牌
router.get('/refresh', async (ctx: any) => {
  const { data: decode } = jwt.parseHeader(ctx, TokenType.REFRESH);
  const { accessToken: access_token, refreshToken: refresh_token } =
    jwt.getTokens({
      id: decode.id,
      admin: Number(decode.admin),
    });
  throw new DataResponse({ access_token, refresh_token }, '令牌更新成功');
});

// 获取当前登录用户信息
router.get('/current', new Auth().init, async (ctx: any) => {
  const user = ctx.user;
  const res = await userModels.getUserById(user.id);
  throw new DataResponse(res);
});

// 获取指定用户信息
router.get('/get_user', new Auth().init, async (ctx: any) => {
  const vs = await new GetUserValidator().validate(ctx);
  const { id, email, phone } = vs.get('query');
  let res: any;
  if (id) {
    res = await userModels.getUser(id, 'id'); // 查询人
  } else if (email) {
    res = await userModels.getUser(email, 'email'); // 查询人
  } else if (phone) {
    res = await userModels.getUser(phone, 'phone'); // 查询人
  } else {
    throw new ParamsErr('缺少查询条件', 4);
  }
  const user = ctx.user; // 当前登录人
  if (user.admin < res.admin) {
    throw new AuthFailed('权限不足, 无法查看对方信息', 4102);
  } else {
    throw new DataResponse(formatUser(res)[0]);
  }
});

// 获取指定用户是否存在
router.get('/has_user', async (ctx: any) => {
  const vs = await new GetUserValidator().validate(ctx);
  const { id, email, phone } = vs.get('query');
  let res: any;
  if (id) {
    res = await userModels.getUser(id, 'id'); // 查询人
  } else if (email) {
    res = await userModels.getUser(email, 'email'); // 查询人
  } else if (phone) {
    res = await userModels.getUser(phone, 'phone'); // 查询人
  } else {
    throw new ParamsErr('缺少查询条件', 4);
  }
  throw new DataResponse({ has_user: !!res.length });
});

// 注册
router.post('/register', async ctx => {
  const vs = await new RegisterValidator().validate(ctx);
  const { name, email, password, code } = vs.get('body');
  // 判断是否注册过
  const registered = await userModels.getUser(email, 'email');
  if (registered.length) throw new ErrorResponse('此账号已注册!');
  // 昵称是否重复
  const named = await userModels.getUser(name, 'name');
  if (named.length) throw new ErrorResponse('昵称已存在!');
  // 校验验证码
  await emailUtils.verifyCode(email, code);
  // 插入数据
  await userModels.addUser({ name, email, password });
  throw new SuccessResponse();
});

// 修改用户信息
router.post('/update', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const data = vs.get('body');
  await userModels.updateUser(ctx.user.id, data);
  throw new SuccessResponse();
});

// 通过邮箱验证修改密码
router.post('/update_password', async (ctx: any) => {
  const vs = await new UpdatePasswordValidator().validate(ctx);
  const { email, code, password } = vs.get('body');
  await emailUtils.verifyCode(email, code);
  await userModels.updatePassword(email, password);
  throw new SuccessResponse();
});

// 发送验证码
router.post('/email/code', async ctx => {
  const vs = await new EmailCodeValidator().validate(ctx);
  const { email, reason } = vs.get('body');
  await emailUtils.sendCode(email, reason);
});

// 校验验证码
router.post('/email/validate', async ctx => {
  const vs = await new EmailValidator().validate(ctx);
  const { email, code } = vs.get('body');
  await emailUtils.verifyCode(email, code);
  throw new SuccessResponse('验证码校验成功');
});

// 管理员获取所有用户
router.post('/list', new Auth(ADMIN.READ).init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { querys, orders, pages } = vs.get('body');
  const res: any = await userModels.getAll(querys, orders, pages);
  throw new DataResponse(res);
});

export default router;
// module.exports = router;
