/*
 * @Author: Rock Chang
 * @Date: 2021-08-08 17:25:29
 * @LastEditTime: 2021-11-10 15:24:54
 * @Description: main.ts
 */
import Koa from 'koa';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import jsonutil from 'koa-json';
import cors from '@koa/cors';
import compose from 'koa-compose';
import compress from 'koa-compress';
import InitManager from '@/core/init';
import catchError from '@/middlewares/exception';
// import { query } from '@/utils/query';
import { SERVICE } from '@/constant/config';

const app = new Koa(); // 创建koa应用

// 将常用方法注入ctx
// app.use(async (ctx, next) => {
//   ctx.execSql = query; // 查库方法
//   await next();
// });

/**
 * 使用koa-compose 集成中间件
 */
const middleware = compose([
  // 全局异常
  catchError,
  // 参数解析
  bodyParser(),
  // 静态资源
  koaStatic('public'),
  // 跨域处理
  cors(),
  // json处理
  jsonutil({ pretty: false, param: 'pretty' }),
  // 请求头处理(安全)
  helmet(),
]);
app.use(middleware);

const isDevMode = process.env.NODE_ENV === 'production' ? false : true;
if (!isDevMode) {
  // 启用压缩
  app.use(compress());
}

// 初始化
new InitManager(app).init();
// 启动服务
app.listen(SERVICE.PORT, () => {
  console.log(`应用已经启动，http://localhost:${SERVICE.PORT}`);
});
