import Koa from 'koa';
import path from 'path';
import koabody from 'koa-body'; // 解析参数,和body-parser相比,支持上传功能
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

app.use(
  koabody({
    multipart: true, // 支持文件上传
    formidable: {
      uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: () => {
        // 文件上传前的设置
        // console.log(`name: ${name}`);
        // console.log(file);
      },
    },
  })
);

// 初始化
new InitManager(app).init();

// 启动服务
app.listen(SERVICE.PORT, () => {
  console.log(`应用已经启动，http://localhost:${SERVICE.PORT}`);
});
