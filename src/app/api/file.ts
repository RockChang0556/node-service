/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 10:12:10
 * @LastEditTime: 2021-08-20 23:18:45
 * @Description: 文件相关接口
 */
import Router from 'koa-router';
import { Auth } from '@/middlewares/auth';
import { DataResponse, ErrorResponse } from '@/core/http-exception';
import { PositiveIntValidator, Validator } from '@/app/validators/demo';
import { ADMIN } from '@/constant/emun';
import { file } from '@/utils/file';
import { File } from '@/app/models/file';
const fileModel = new File();

const router = new Router();
// 接口前缀
router.prefix(`/file`);

// 上传文件
router.post('/upload', new Auth().init, async (ctx: any, next) => {
  const files: any = await file.upload(ctx, next);
  delete files.md5;
  throw new DataResponse(files);
});

// 获取文件信息
router.get('/getfile', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('query');
  const res: any = await fileModel.getFile('id', id);
  if (!res.length) {
    throw new ErrorResponse('获取文件信息失败!');
  } else {
    const file = res[0];
    delete file.md5;
    throw new DataResponse(file);
  }
});

// 获取所有文件
router.post('/list', new Auth(ADMIN.READ).init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { querys, orders, pages } = vs.get('body');
  const res: any = await fileModel.getAll(querys, orders, pages);
  throw new DataResponse(res);
});

module.exports = router;
