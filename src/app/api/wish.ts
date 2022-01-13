/*
 * @Author: Rock Chang
 * @Date: 2022-01-06 12:24:12
 * @LastEditTime: 2022-01-13 18:54:04
 * @Description: 吃什么 - 心愿单接口
 */
import Router from 'koa-router';
import { Auth } from '@/middlewares/auth';
import {
  DataResponse,
  SuccessResponse,
  ErrorResponse,
} from '@/core/http-exception';
import {
  PositiveIntValidator,
  NameValidator,
  Validator,
} from '@/app/validators/demo';
import { NameIdValidator, UpdatefoodValidator } from '@/app/validators/wish';
import { API } from '@/constant/config';
import { WishModel } from '@/app/model/wish';
import { FoodModel } from '@/app/model/food';
import { ERR_CODE } from '@/constant/emun';
import { removeEmpty } from '@/utils/utils';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/chang/wish`);

// 新增心愿单
router.post('/add', new Auth().init, async (ctx: any) => {
  const vs = await new NameValidator().validate(ctx);
  const { name, summary, tag, food_list } = vs.get('body');
  const user = ctx.user;
  const res = await WishModel.create({
    uid: user.id,
    name,
    summary,
    tag,
    food_list,
  });
  throw new DataResponse(res);
});

// 删除心愿单
router.delete('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const user = ctx.user;
  // 判断要删除的是否存在
  const res = await WishModel.getOne({ uid: user.id, id });
  if (!res) throw new ErrorResponse(ERR_CODE[7]);
  // 删除
  await WishModel.destroy({ where: { id } });
  throw new SuccessResponse();
});

// 更新心愿单
router.put('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new NameIdValidator().validate(ctx);
  const { id } = vs.get('path');
  const { name, summary, tag, food_list } = vs.get('body');
  const data = removeEmpty({ name, summary, tag, food_list }); // 去除值为null|undefined的属性
  // 判断要更新的是否存在
  const getRes = await WishModel.getOne({ uid: ctx.user.id, id });
  if (!getRes) throw new ErrorResponse(ERR_CODE[7]);
  // 更新
  const updateRes = await WishModel.update(data, { where: { id } });
  if (updateRes[0] > 0) {
    // 更新成功, 返回新数据
    const res = await WishModel.findByPk(id);
    throw new DataResponse(res);
  } else {
    new ErrorResponse(ERR_CODE[8]);
  }
});

// 获取登陆用户名下心愿单
router.post('/list', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { pages, querys, orders } = vs.get('body');
  const user = ctx.user;
  const res = await WishModel.getAll(
    { pages, querys, orders },
    { uid: user.id }
  );
  throw new DataResponse(res);
});

// 获取心愿单详情
router.get('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const wishRes: any = await WishModel.getOne({
    uid: ctx.user.id,
    id,
  });
  // 获取心愿单详情失败
  if (!wishRes) throw new ErrorResponse(ERR_CODE[5000]);
  // 心愿单下没有菜品, 直接返回
  if (!wishRes.food_list) {
    throw new DataResponse(wishRes);
  } else {
    const foodList = wishRes.food_list.split(',');
    // 获取菜品详情
    const foodRes = await FoodModel.findAll({
      where: { id: foodList },
    });
    // 查出来详情数量与id数量不一直, 说明有菜品删除了, 但是没有同步在愿望单里删除
    if (foodRes.length !== foodList.length) {
      wishRes.food_list = foodList.map((v: string) => {
        const findOne = foodRes.find((v2: any) => v2.id === v);
        if (!findOne) {
          return { id: v, name: '菜品不存在', deleted: true };
        } else {
          return findOne;
        }
      });
    } else {
      wishRes.food_list = foodRes;
    }
    throw new DataResponse(wishRes);
  }
});

// 更新心愿单下菜品
router.put('/:id/updatefood', new Auth().init, async (ctx: any) => {
  const vs = await new UpdatefoodValidator().validate(ctx);
  const { id } = vs.get('path');
  const { type, food_ids } = vs.get('body');
  const user = ctx.user;
  // 判断要更新的是否存在
  const getRes: any = await WishModel.getOne({
    uid: user.id,
    id,
  });
  if (!getRes) throw new ErrorResponse(ERR_CODE[7]);
  let food_list = getRes.food_list ? getRes.food_list.split(',') : [];
  // 添加菜品
  if (type === 'add') {
    food_list = [...new Set([...food_ids, ...food_list])];
    // 删除菜品
  } else if (type === 'delete') {
    food_list = food_list.filter((v: string) => !food_ids.includes(v));
  }
  // 更新
  const updateRes = await WishModel.update(
    { food_list: food_list.join(',') },
    { where: { id } }
  );
  if (updateRes[0] > 0) {
    // 更新成功
    throw new SuccessResponse();
  } else {
    new ErrorResponse(ERR_CODE[8]);
  }
});

export default router;
