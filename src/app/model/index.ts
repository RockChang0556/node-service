/*
 * @Author: Rock Chang
 * @Date: 2022-01-14 10:26:12
 * @LastEditTime: 2022-01-14 10:33:39
 * @Description: 模型关系处理 / 首页
 */
import { FileModel } from './file';
import { FoodModel } from './food';
import { UserModel } from './user';
import { WishModel } from './wish';

UserModel.hasMany(WishModel, {
  foreignKey: 'uid',
  as: 'wish_list',
});
WishModel.belongsTo(UserModel);

export { FileModel, FoodModel, UserModel, WishModel };
