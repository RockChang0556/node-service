/*
 * @Author: Rock Chang
 * @Date: 2021-04-25 10:23:09
 * @LastEditTime: 2022-01-10 11:21:56
 * @Description: 异常处理中间件 - 包含正确的数据
 */
// import { ENV } from '@/constant/config';
import { HttpException } from '@/core/http-exception';

const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // 错误是否是HttpException抛出的
    const isHttpException = error instanceof HttpException;
    // 是否是开发环境
    const isDevMode = process.env.NODE_ENV === 'production' ? false : true;
    if (isDevMode && !isHttpException) {
      throw error;
    }
    // 已知异常
    if (isHttpException) {
      ctx.body = {
        code: error.code,
        message: error.message,
        request_url: `${ctx.method} ${ctx.path}`,
      };
      if (error.data) {
        ctx.body.data = error.data;
      }
      ctx.status = error.status || 500;
      // 未知异常
    } else {
      ctx.body = {
        code: -1,
        message: '系统异常, 请稍后再试',
        request_url: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = 500;
    }
  }
};

export default catchError;
