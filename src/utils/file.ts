/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 14:11:05
 * @LastEditTime: 2021-08-18 18:49:22
 * @Description: 文件类, 提供文件上传功能
 *
 * 不用koa-body原因, 开发时候没有拿到上传成功的回调
 * busboy
 */

const multer = require('@koa/multer');
import * as fs from 'fs';
import * as crypto from 'crypto';
import { ErrorResponse } from '@/core/http-exception';
import { FILE } from '@/constant/config';
import { File } from '@/app/models/file';
const fileModel = new File();

// 文件地址和文件名设置
const storage = multer.diskStorage({
  destination: FILE.OUT_DIR,
  filename(ctx, file, cb) {
    const filenameArr = file.originalname.split('.');
    cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1]);
  },
});
//文件上传限制
const limits = {
  fields: 10, //非文件字段的数量
  fileSize: FILE.UPLOAD_SIZE, // 文件大小限制
  files: 1, //文件数量
};
const upload = multer({ storage, limits });

class FileUtil {
  // 上传文件
  async upload(ctx, next) {
    let err = await upload
      .single('file')(ctx, next)
      .then(res => res)
      .catch(err => err);
    if (err) {
      throw new ErrorResponse(err.message || '上传失败', 1001);
    }
    const reqFile = ctx.file;
    if (!reqFile) {
      throw new ErrorResponse('请传入文件', 1002);
    }
    let file = {};
    const md5 = this.generateMd5(reqFile.path);
    const res = await fileModel.getFile('md5', md5);
    // 根据 md5判断文件是否存在数据库, 存在直接返回数据库存的信息, 不存在则插入数据库
    if (res.length) {
      file = res[0];
    } else {
      file = {
        fieldname: reqFile.fieldname,
        encoding: reqFile.encoding,
        destination: reqFile.destination,
        filename: reqFile.filename,
        filetype: reqFile.mimetype,
        originalname: reqFile.originalname,
        path: `/uploads/${reqFile.filename}`,
        size: reqFile.size,
        md5,
      };
      // 向数据库插入文件数据
      await fileModel.addFile(file);
    }
    return file;
  }

  // 生成文件的 md5
  generateMd5(path: string) {
    const hash = crypto.createHash('md5');
    const buffer = fs.readFileSync(path);
    return hash.update(buffer).digest('hex');
  }
}

const file = new FileUtil();
export { file };
