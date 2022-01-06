/*
 * @Author: Peng zhang
 * @Date: 2021-02-25 21:37:02
 * @LastEditTime: 2022-01-06 11:40:08
 * @Description: 用户相关接口
 */
import bcrypt from 'bcryptjs';

import Router from 'koa-router';
import { Op } from 'sequelize';
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
  AccountValidator,
  LoginValidator,
  RegisterValidator,
  EmailCodeValidator,
  UpdatePasswordValidator,
  GetUserValidator,
} from '@/app/validators/user';
import { jwt, TokenType } from '@/utils/jwt';
import { emailUtils, captchaCode } from '@/utils/email';
import { ADMIN, ERR_CODE } from '@/constant/emun';
import { API } from '@/constant/config';
import { UserModel } from '@/app/model/user';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/user`);

// 登陆
router.post('/login', async ctx => {
  const vs = await new Validator().validate(ctx);
  const { account, password, sid, captcha, register } = vs.get('body');
  // 非注册自动登录的,校验图形验证码
  if (!register) {
    await new LoginValidator().validate(ctx);
    await captchaCode.verifyCode(sid, captcha);
  } else {
    await new AccountValidator().validate(ctx);
  }
  const res: any = await UserModel.findOne({
    where: {
      [Op.or]: [{ email: account }, { phone: account }],
    },
  });
  if (res) {
    // 校验密码 user.password === plainPassword
    const correct = bcrypt.compareSync(password, res.password);
    if (correct) {
      const { accessToken: access_token, refreshToken: refresh_token } =
        jwt.getTokens({
          id: res.id,
          admin: Number(res.admin),
        });
      throw new DataResponse({ access_token, refresh_token }, ERR_CODE[1002]);
    } else {
      throw new ErrorResponse(ERR_CODE[1003]);
    }
  } else {
    throw new ErrorResponse(ERR_CODE[1004]);
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
  throw new DataResponse({ access_token, refresh_token }, ERR_CODE[4003]);
});

// 获取当前登录用户信息
router.get('/current', new Auth().init, async (ctx: any) => {
  const user = ctx.user;
  const res = await UserModel.getUser(user.id);
  if (res) {
    throw new DataResponse(res);
  } else {
    throw new AuthFailed(ERR_CODE[1000], 1000);
  }
});

// 获取指定用户信息
router.get('/get_user', new Auth().init, async (ctx: any) => {
  const vs = await new GetUserValidator().validate(ctx);
  const { id, email, phone } = vs.get('query');
  let res: any;
  if (id) {
    res = await UserModel.getUser(id, 'id'); // 查询人
  } else if (email) {
    res = await UserModel.getUser(email, 'email'); // 查询人
  } else if (phone) {
    res = await UserModel.getUser(phone, 'phone'); // 查询人
  } else {
    throw new ParamsErr(ERR_CODE[6], 6);
  }
  const user = ctx.user; // 当前登录人
  if (user.admin < res.admin) {
    throw new AuthFailed(ERR_CODE[1001], 1001);
  } else {
    throw new DataResponse(res);
  }
});

// 获取指定用户是否存在
router.get('/has_user', async (ctx: any) => {
  const vs = await new GetUserValidator().validate(ctx);
  const { id, email, phone } = vs.get('query');
  let res: any;
  if (id) {
    res = await UserModel.getUser(id, 'id'); // 查询人
  } else if (email) {
    res = await UserModel.getUser(email, 'email'); // 查询人
  } else if (phone) {
    res = await UserModel.getUser(phone, 'phone'); // 查询人
  } else {
    throw new ParamsErr(ERR_CODE[6], 6);
  }
  throw new DataResponse({ has_user: !!res });
});

// 注册
router.post('/register', async ctx => {
  const vs = await new RegisterValidator().validate(ctx);
  const { name, email, password, code } = vs.get('body');
  // 判断是否注册过
  const user = await UserModel.getUser(email, 'email');
  if (user) throw new ErrorResponse(ERR_CODE[1005]);
  // 昵称是否重复
  const named = await UserModel.getUser(name, 'name');
  if (named) throw new ErrorResponse(ERR_CODE[1006]);
  // 校验邮箱验证码
  await emailUtils.verifyCode(email, code);
  // 插入数据
  await UserModel.create({ name, email, password });
  throw new SuccessResponse();
});

// 修改用户信息
router.post('/update', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const data = vs.get('body');
  await UserModel.update({ ...data }, { where: { id: ctx.user.id } });
  throw new SuccessResponse();
});

// 通过邮箱验证修改密码
router.post('/update_password', async (ctx: any) => {
  const vs = await new UpdatePasswordValidator().validate(ctx);
  const { email, code, password } = vs.get('body');
  await emailUtils.verifyCode(email, code);
  await UserModel.update({ password }, { where: { email } });
  throw new SuccessResponse();
});

// 发送邮箱验证码
router.post('/email/code', async ctx => {
  const vs = await new EmailCodeValidator().validate(ctx);
  const { email, reason } = vs.get('body');
  await emailUtils.sendCode(email, reason);
});

// 发送图形验证码
router.get('/getCaptcha', async ctx => {
  const vs = await new Validator().validate(ctx);
  const { sid } = vs.get('query');
  const newCaptca = await captchaCode.sendCode(sid);
  throw new DataResponse(newCaptca.data);
});

// 管理员获取所有用户
router.post('/list', new Auth(ADMIN.READ).init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { querys, orders, pages } = vs.get('body');
  const res: any = await UserModel.getAll(querys, orders, pages);
  throw new DataResponse(res);
});

export default router;
// module.exports = router;
