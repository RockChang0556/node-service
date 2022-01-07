/*
 * @Author: Rock Chang
 * @Date: 2021-11-18 23:25:15
 * @LastEditTime: 2022-01-06 14:20:03
 * @Description: 路由整合
 */
import combineRoutes from 'koa-combine-routers';

import demoRouter from '@/app/api/demo';
import fileRouter from '@/app/api/file';
import userRouter from '@/app/api/user';
import wishRouter from '@/app/api/wish';

export default combineRoutes(demoRouter, fileRouter, userRouter, wishRouter);
