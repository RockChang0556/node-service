/*
 * @Author: Rock Chang
 * @Date: 2022-01-14 16:11:53
 * @LastEditTime: 2022-01-14 16:18:39
 * @Description: 业务表  心愿单:菜品   M:N
 */

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/core/db';

class WishFoodModel extends Model {}
WishFoodModel.init(
  {
    wish_id: {
      type: DataTypes.STRING,
      comment: '心愿单id',
    },
    food_id: {
      type: DataTypes.STRING,
      comment: '菜品id',
    },
  },
  {
    sequelize,
    tableName: 'wish_food',
  }
);

export { WishFoodModel };
