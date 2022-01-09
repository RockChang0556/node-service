/*
 * @Author: Rock Chang
 * @Date: 2022-01-06 12:24:12
 * @LastEditTime: 2022-01-09 22:12:46
 * @Description: 吃什么 - 菜品接口
 */
import Router from 'koa-router';
import { Auth } from '@/middlewares/auth';
import {
  DataResponse,
  SuccessResponse,
  ErrorResponse,
} from '@/core/http-exception';
import { PositiveIntValidator, Validator } from '@/app/validators/demo';
import { ADMIN } from '@/constant/emun';
import { API } from '@/constant/config';
import { FoodModel } from '@/app/model/food';
import { ERR_CODE } from '@/constant/emun';
import { removeEmpty } from '@/utils/utils';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/chang/food`);

// 新增菜品
router.post('/add', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const {
    id,
    name,
    pic,
    content,
    favs,
    peoplenum,
    cookingtime,
    tag,
    material,
    process,
  } = vs.get('body');
  const data = removeEmpty({
    id,
    name,
    pic,
    content,
    favs,
    peoplenum,
    cookingtime,
    tag,
    material,
    process,
  });
  // 存在id说明是jd的数据, 默认创建者1, 没有 id 则带上 uid
  if (id) {
    // 判断要新增的是否存在
    const AddRes = await FoodModel.getOne({
      id,
    });
    if (AddRes) throw new DataResponse(AddRes);
    // jd的数据 tag为string, 需转换为数组
    data.tag = tag ? (typeof tag === 'string' ? tag.split(',') : tag) : [];
    // if (AddRes) throw new ErrorResponse(ERR_CODE[5100]);
  } else {
    data.uid = ctx.user.id;
  }
  const res = await FoodModel.create(data);
  throw new DataResponse(res);
});

// 删除菜品
router.delete('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const user = ctx.user;
  // 判断要删除的是否存在
  const res = await FoodModel.getOne({
    uid: user.id,
    id,
  });
  if (!res) throw new ErrorResponse(ERR_CODE[7]);
  // 删除
  await FoodModel.destroy({
    where: {
      uid: user.id,
      id,
    },
  });
  throw new SuccessResponse();
});

// 更新菜品
router.put('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const { name, summary, tag, food_list } = vs.get('body');
  const data = removeEmpty({ name, summary, tag, food_list }); // 去除值为null|undefined的属性
  const user = ctx.user;
  // 判断要删除的是否存在
  const deleteRes = await FoodModel.getOne({
    uid: user.id,
    id,
  });
  if (!deleteRes) throw new ErrorResponse(ERR_CODE[7]);
  // 更新
  const updateRes = await FoodModel.update(data, {
    where: { id },
  });
  if (updateRes[0] > 0) {
    // 更新成功, 返回新数据
    const res = await FoodModel.getOne({ id });
    throw new DataResponse(res);
  } else {
    new ErrorResponse(ERR_CODE[8]);
  }
});

// 获取登陆用户创建的菜品
router.post('/list', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { pages, querys, orders } = vs.get('body');
  const user = ctx.user;
  const res = await FoodModel.getAll(
    { pages, querys, orders },
    { uid: user.id }
  );
  throw new DataResponse(res);
});

// 获取菜品详情
router.get('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new PositiveIntValidator().validate(ctx);
  const { id } = vs.get('path');
  const res = await FoodModel.findByPk(id);
  // 获取心愿单详情失败
  if (!res) throw new ErrorResponse(ERR_CODE[5101]);
  throw new DataResponse(res);
});

export default router;
