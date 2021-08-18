/*
 * @Author: Rock Chang
 * @Date: 2021-08-08 17:25:29
 * @LastEditTime: 2021-08-17 18:46:57
 * @Description: main.ts
 */
import Koa from 'koa';
import koaStatic from 'koa-static';
import bodyParser from 'koa-bodyparser';
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
// 全局异常
app.use(catchError);

// 静态资源
app.use(koaStatic('public'));
// 参数解析
app.use(bodyParser());

// 初始化
new InitManager(app).init();

// 启动服务
app.listen(SERVICE.PORT, () => {
  console.log(`应用已经启动，http://localhost:${SERVICE.PORT}`);
});
