/*
 * @Author: Rock Chang
 * @Date: 2022-01-14 10:26:12
 * @LastEditTime: 2022-01-25 21:36:03
 * @Description: 模型关系处理 / 首页
 */
import { FileModel } from './file';
import { FoodModel } from './food';
import { UserModel } from './user';
import { WishModel } from './wish';
import { WishFoodModel } from './wish_food';
import { FoodLikesModel } from './food_likes';

// 用户:心愿单   1:N
UserModel.hasMany(WishModel, {
  foreignKey: 'uid',
  as: 'wish_list',
});
WishModel.belongsTo(UserModel, {
  foreignKey: 'uid',
  as: 'user_info',
});

// 用户:菜品   1:N
UserModel.hasMany(FoodModel, {
  foreignKey: 'uid',
  sourceKey: 'id',
  // as: 'food_list',
});
FoodModel.belongsTo(UserModel, {
  foreignKey: 'uid',
  targetKey: 'id',
  as: 'creator',
});

// 心愿单:菜品   M:N
WishModel.belongsToMany(FoodModel, {
  through: WishFoodModel,
  foreignKey: 'wish_id',
  as: 'food_list',
});
FoodModel.belongsToMany(WishModel, {
  through: WishFoodModel,
  foreignKey: 'food_id',
});

export {
  FileModel,
  FoodModel,
  UserModel,
  WishModel,
  WishFoodModel,
  FoodLikesModel,
};
