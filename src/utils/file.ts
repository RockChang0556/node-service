/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 14:11:05
 * @LastEditTime: 2022-01-05 19:19:19
 * @Description: 文件类, 提供文件上传功能
 *
 * 不用koa-body原因, 开发时候没有拿到上传成功的回调
 * busboy
 */

import fs from 'fs';
import crypto from 'crypto';
import mkdir from 'make-dir';
import moment from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { ErrorResponse } from '@/core/http-exception';
import { ERR_CODE } from '@/constant/emun';
import { FileModel } from '@/app/model/file';
import { FILE } from '@/constant/config';

class FileUtil {
  // 上传文件
  async upload(ctx) {
    let reqFile = ctx.request.files?.file;
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
      // 写入文件
      const { filePath, fileName } = await this.writeFile(reqFile);
      const files = {
        filename: fileName,
        filetype: reqFile.type,
        originalname: reqFile.name,
        path: `/uploads${filePath}`,
        size: reqFile.size,
        md5,
      };
      // 向数据库插入文件数据
      file = await FileModel.create(files);
    }
    return file;
  }

  // 生成文件的 md5
  generateMd5(path: string) {
    const hash = crypto.createHash('md5');
    const buffer = fs.readFileSync(path);
    return hash.update(buffer).digest('hex');
  }
  // 写入文件
  async writeFile(reqFile) {
    const ext = reqFile.name.split('.').pop();
    const dir = `${FILE.OUT_DIR}/${moment().format('YYYYMMDD')}`;
    // 判断目录是否存在, 不存在则创建
    await mkdir(dir);
    const filename = uuidv4();
    const destPath = `${dir}/${filename}.${ext}`;

    const read = fs.createReadStream(reqFile.path);
    const upStream = fs.createWriteStream(destPath);

    const fileSize = reqFile.size; // 文件大小
    if (fileSize < 1 * 1024 * 1024) {
      // 小于1M文件直接写入
      read.pipe(upStream);
    } else {
      // 大文件采用读写流方式写入, 读取流默认 64k 一次
      // let totalLen = 0;
      read.on('data', chunk => {
        // totalLen += chunk.length;
        if (upStream.write(chunk) === false) {
          read.pause();
        }
      });
      read.on('drain', () => {
        read.resume();
      });
      read.on('end', () => {
        upStream.end();
      });
    }

    const filePath = `/${moment().format('YYYYMMDD')}/${filename}.${ext}`;
    return { filePath, fileName: `${filename}.${ext}` };
  }
}

const file = new FileUtil();
export { file };
