/*
 * @Author: Rock Chang
 * @Date: 2022-01-06 12:24:12
 * @LastEditTime: 2022-02-24 16:04:28
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
import { WishModel, FoodModel, WishFoodModel } from '@/app/model';
import { ERR_CODE } from '@/constant/emun';
import { removeEmpty } from '@/utils/utils';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/chang/wish`);

// 新增心愿单
router.post('/add', new Auth().init, async (ctx: any) => {
  const vs = await new NameValidator().validate(ctx);
  const { name, summary, tag } = vs.get('body');
  const user = ctx.user;
  const res = await WishModel.create({
    uid: user.id,
    name,
    summary,
    tag,
  });
  throw new DataResponse(res);
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

// 获取心愿单下菜品
router.get('/:id/food_list', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const wishRes: any = await WishModel.getOne({ uid: ctx.user.id, id });
  // 获取心愿单详情失败
  if (!wishRes) throw new ErrorResponse(ERR_CODE[5000]);
  const foodIds = (await WishFoodModel.findAll({ where: { wish_id: id } })).map(
    (v: any) => v.food_id
  );
  // 没有菜品id, 直接返回空数组, 减少数据库操作
  if (!foodIds.length) throw new DataResponse([]);
  // 获取菜品详情
  const foodRes = await FoodModel.getAll(ctx.user.id, {}, { id: foodIds });
  throw new DataResponse(foodRes.rows);
});

// 更新心愿单下菜品
router.put('/:id/updatefood', new Auth().init, async (ctx: any) => {
  const vs = await new UpdatefoodValidator().validate(ctx);
  const { id } = vs.get('path');
  const { type, food_ids } = vs.get('body');
  const user = ctx.user;
  // 判断要更新的是否存在
  const getRes: any = await WishModel.getOne({ uid: user.id, id });
  if (!getRes) throw new ErrorResponse(ERR_CODE[7]);
  if (!food_ids.length) throw new SuccessResponse();
  await WishModel.updateFoods(id, type, food_ids);
  throw new SuccessResponse();
});

// 获取心愿单基本信息
router.get('/:id/base', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const wishRes: any = await WishModel.getOne({ uid: ctx.user.id, id });
  // 获取心愿单详情失败
  if (!wishRes) throw new ErrorResponse(ERR_CODE[5000]);
  throw new DataResponse(wishRes);
});

// 更新心愿单基本信息
router.put('/:id/base', new Auth().init, async (ctx: any) => {
  const vs = await new NameIdValidator().validate(ctx);
  const { id } = vs.get('path');
  const { name, summary, tag } = vs.get('body');
  const data = removeEmpty({ name, summary, tag }); // 去除值为null|undefined的属性
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

export default router;
