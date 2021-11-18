/*
 * @Author: Peng zhang
 * @Date: 2021-02-25 21:37:02
 * @LastEditTime: 2021-11-18 23:42:34
 * @Description: 路由文件-demo
 */

import Router from 'koa-router';
import { PositiveIntValidator } from '../validators/demo';
import { ParamsErr } from '../../core/http-exception';
import { API } from '@/constant/config';

const router = new Router();
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/demo`);

router.get('/get', async ctx => {
  // http://localhost:3000/api/demo/get?id=1  => {id: 1}
  const v = await new PositiveIntValidator().validate(ctx);
  const id = v.get('query.id');
  if (id) {
    ctx.body = ctx.request.query;
  } else {
    throw new ParamsErr('id必填');
  }
});

router.post('/post', async (ctx: any) => {
  console.log('post', ctx.request.body);
  ctx.body = ctx.request.body;
});

router.get('/json/:id/:ids', async ctx => {
  // http://localhost:3000/api/demo/json/1/2  => {id: 1, ids: 2}
  console.log('params', ctx.params);
  ctx.body = ctx.params;
});

export default router;
