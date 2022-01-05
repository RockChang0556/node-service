/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 10:12:10
 * @LastEditTime: 2022-01-05 19:20:21
 * @Description: 文件相关接口
 */
import fs from 'fs';
import Router from 'koa-router';
import { Auth } from '@/middlewares/auth';
import {
  DataResponse,
  SuccessResponse,
  ErrorResponse,
} from '@/core/http-exception';
import { PositiveIntValidator, Validator } from '@/app/validators/demo';
import { ADMIN } from '@/constant/emun';
import { file } from '@/utils/file';
import { API } from '@/constant/config';
import { FileModel } from '@/app/model/file';
import { UserModel } from '@/app/model/user';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/file`);

// 上传文件
router.post('/upload', new Auth().init, async (ctx: any) => {
  const files: any = await file.upload(ctx);
  delete files.md5;
  throw new DataResponse(files);
});

// 获取文件信息
router.get('/getfile', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('query');
  const res: any = await FileModel.getOne(id);
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
  const res: any = await FileModel.getAll(querys, orders, pages);
  throw new DataResponse(res);
});

// 清理文件 - 删除非用户头像文件
router.get('/resetAvatar', new Auth(ADMIN.SUPER).init, async () => {
  // 所有用户头像
  let avatarUrls: any = await UserModel.getAllPath();
  avatarUrls = avatarUrls.filter(v => v.avatar_url);
  // 读取本地文件
  const files = fs.readdirSync('public/uploads');
  files.forEach(async v => {
    const path = `/uploads/${v}`;
    const hav = avatarUrls.find(v2 => {
      return v2.avatar_url === path;
    });
    if (!hav) {
      // 不是用户头像, 删除本地文件
      fs.unlinkSync(`public${path}`);
      // 删除数据库记录
      // await fileModels.deleteFile(path);
    }
  });
  throw new SuccessResponse();
});

export default router;
