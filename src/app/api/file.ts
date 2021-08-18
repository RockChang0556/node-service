/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 10:12:10
 * @LastEditTime: 2021-08-17 18:37:20
 * @Description: 文件相关接口
 */
import Router from 'koa-router';
import { Auth } from '@/middlewares/auth';
import { DataResponse, ErrorResponse } from '@/core/http-exception';
import { PositiveIntValidator } from '@/app/validators/demo';
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

module.exports = router;
