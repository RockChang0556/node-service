/*
 * @Author: Rock Chang
 * @Date: 2022-01-06 12:24:12
 * @LastEditTime: 2022-01-28 19:13:53
 * @Description: 吃什么 - 菜品接口
 */
import Router from 'koa-router';
import { Auth } from '@/middlewares/auth';
import {
  DataResponse,
  SuccessResponse,
  ErrorResponse,
} from '@/core/http-exception';
import { NameValidator, Validator } from '@/app/validators/demo';
import { NameIdValidator } from '@/app/validators/wish';
import { LimitIntValidator, LikesValidator } from '@/app/validators/food';
import { API } from '@/constant/config';
import { FoodModel, FoodLikesModel } from '@/app/model';
import { ERR_CODE } from '@/constant/emun';
import { removeEmpty } from '@/utils/utils';
import { sequelize } from '@/core/db';

const router = new Router();
// 接口前缀
router.prefix(`${API.PROJECT_INTERFACE_PREFIX}/chang/food`);

// 获取登陆用户点赞过的菜品
router.post('/likelist', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { pages, querys, orders } = vs.get('body');
  const userid = ctx.user.id;
  const likeRes = await FoodLikesModel.getAll(
    { pages, querys, orders },
    { uid: userid }
  );
  const foodids = likeRes.rows.map((v: any) => v.food_id);
  const foodRes = await FoodModel.getAll(userid, {}, { id: foodids });
  throw new DataResponse(foodRes);
});

// 点赞/取消点赞 菜品
router.put('/:id/likes', new Auth().init, async (ctx: any) => {
  const vs = await new LikesValidator().validate(ctx);
  const { type } = vs.get('body');
  const { id } = vs.get('path');
  // 判断要操作的是否存在
  const getRes = await FoodModel.findByPk(id);
  if (!getRes) throw new ErrorResponse(ERR_CODE[5105]);

  if (type === 'like') {
    await FoodLikesModel.like(ctx.user.id, id);
  } else {
    await FoodLikesModel.dislike(ctx.user.id, id);
  }
  throw new SuccessResponse();
});

// 获取当前用户对当前菜品点赞信息 (点赞数量, 当前用户是否点赞当前菜品)
router.get('/:id/likes', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { id } = vs.get('path');
  // 判断要查询的是否存在
  const getRes: any = await FoodModel.findByPk(id);
  if (!getRes) throw new ErrorResponse(ERR_CODE[9]);
  const likeRes = await FoodLikesModel.findOne({
    where: { uid: ctx.user.id, food_id: id },
  });
  throw new DataResponse({
    islike: Boolean(likeRes),
    like_nums: getRes.favs,
  });
});

// 新增菜品
router.post('/add', new Auth().init, async (ctx: any) => {
  const vs = await new NameValidator().validate(ctx);
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
  const data: any = removeEmpty({
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
  // 存在id说明是jd的数据, 默认创建者1
  if (id) {
    // 判断要新增的是否存在, 存在直接返回
    const AddRes = await FoodModel.getOne({ id });
    if (AddRes) throw new DataResponse(AddRes);
    // jd的数据 tag为string, 需转换为数组
    data.tag = tag ? (typeof tag === 'string' ? tag.split(',') : tag) : [];
    // if (AddRes) throw new ErrorResponse(ERR_CODE[5100]);
    // 没有id说明是自建数据, 则带上 uid
  } else {
    data.uid = ctx.user.id;
  }
  const res = await FoodModel.create(data);
  throw new DataResponse(res);
});

// 获取登陆用户创建的菜品
router.post('/list', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { pages, querys, orders } = vs.get('body');
  const user = ctx.user;
  const res = await FoodModel.getAll(
    user.id,
    { pages, querys, orders },
    { uid: user.id }
  );
  throw new DataResponse(res);
});

// 随机获取多个菜品
router.get('/random', async (ctx: any) => {
  const vs = await new LimitIntValidator().validate(ctx);
  const { limit } = vs.get('query');
  const res = await FoodModel.findAll({
    attributes: ['id', 'name'],
    limit: limit || 10,
    order: sequelize.literal('rand()'),
  });
  // 获取心愿单详情失败
  if (!res) throw new ErrorResponse();
  throw new DataResponse(res);
});

// 获取菜品详情
router.get('/:id', async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { id } = vs.get('path');
  const res: any = await FoodModel.getDetail({ id });
  res.includes = ['created_at'];
  // 获取心愿单详情失败
  if (!res) throw new ErrorResponse(ERR_CODE[5101]);
  throw new DataResponse(res);
});

// 删除菜品
router.delete('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new Validator().validate(ctx);
  const { id } = vs.get('path');
  const user = ctx.user;
  // 判断要删除的是否存在
  const res = await FoodModel.getOne({ uid: user.id, id });
  if (!res) throw new ErrorResponse(ERR_CODE[5102]);
  // 删除
  await FoodModel.destroy({ where: { uid: user.id, id } });
  throw new SuccessResponse();
});

// 更新菜品
router.put('/:id', new Auth().init, async (ctx: any) => {
  const vs = await new NameIdValidator().validate(ctx);
  const { id } = vs.get('path');
  const { name, summary, tag, food_list } = vs.get('body');
  const data = removeEmpty({ name, summary, tag, food_list }); // 去除值为null|undefined的属性
  // 判断要更新的是否存在
  const getRes = await FoodModel.getOne({ uid: ctx.user.id, id });
  if (!getRes) throw new ErrorResponse(ERR_CODE[7]);
  // 更新
  const updateRes = await FoodModel.update(data, { where: { id } });
  if (updateRes[0] > 0) {
    // 更新成功, 返回新数据
    const res = await FoodModel.findByPk(id);
    throw new DataResponse(res);
  } else {
    new ErrorResponse(ERR_CODE[8]);
  }
});

export default router;
