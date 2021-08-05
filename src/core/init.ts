/*
 * @Author: Rock Chang
 * @Date: 2021-04-23 15:18:08
 * @LastEditTime: 2021-05-19 17:04:37
 * @Description: 初始化
 */
import * as path from 'path';
import * as fs from 'fs';
import Router from 'koa-router';
import { API } from '@/constant/config';

const projectApiPrefix = API.PROJECT_INTERFACE_PREFIX;
const router = new Router(); // 创建路由，支持传递参数

class InitManager {
  static app: any;
  static init(app) {
    InitManager.app = app;
    InitManager.initRoute();
  }
  // 路由初始化
  static initRoute() {
    // 读取/app/api文件夹中的文件
    fs.readdirSync(path.join(__dirname, '../app/api')).forEach(file => {
      if (new RegExp('\\.(ts|js)$', 'i').test(file)) {
        let controller = require(path.join(__dirname, '../app/api', file));
        // 为接口设置通用前缀
        router.use(
          `${projectApiPrefix}`,
          controller.routes(),
          controller.allowedMethods()
        );
      }
    });
    InitManager.app.use(router.routes());
  }
}

export default InitManager;
