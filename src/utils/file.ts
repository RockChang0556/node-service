/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 14:11:05
 * @LastEditTime: 2021-12-22 17:07:05
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
import { ERR_CODE } from '@/constant/emun';
import { FileModel } from '@/app/model/fie';

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
      throw new ErrorResponse(err.message || ERR_CODE[1500], 1500);
    }
    const reqFile = ctx.file;
    if (!reqFile) {
      throw new ErrorResponse(ERR_CODE[1501], 1501);
    }
    let file = {};
    const md5 = this.generateMd5(reqFile.path);
    const res = await FileModel.findOne({
      where: {
        md5: md5,
      },
    });
    // 根据 md5判断文件是否存在数据库, 存在直接返回数据库存的信息, 不存在则插入数据库
    if (res) {
      file = res;
    } else {
      file = {
        fieldname: reqFile.fieldname,
        encoding: reqFile.encoding,
        filename: reqFile.filename,
        filetype: reqFile.mimetype,
        originalname: reqFile.originalname,
        path: `/uploads/${reqFile.filename}`,
        size: reqFile.size,
        md5,
      };
      // 向数据库插入文件数据
      await FileModel.create(file);
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
