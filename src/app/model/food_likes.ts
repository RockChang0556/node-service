/*
 * @Author: Rock Chang
 * @Date: 2022-01-25 15:57:46
 * @LastEditTime: 2022-01-25 16:56:13
 * @Description: 业务表 菜品点赞
 */
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@/core/db';
import { ErrorResponse } from '@/core/http-exception';
import { ERR_CODE } from '@/constant/emun';
import { FoodModel } from '.';

class FoodLikesModel extends Model {
  // 点赞菜品
  static async like(uid: number, food_id: string) {
    const res = await FoodLikesModel.findOne({ where: { uid, food_id } });
    if (res) throw new ErrorResponse(ERR_CODE[5103]);

    // 事务: [点赞表新增一条数据, 菜品表favs字段+1]
    // 注意: 一定要 return 出去!!
    return sequelize.transaction(async t => {
      await FoodLikesModel.create({ uid, food_id }, { transaction: t });

      const foodRes = await FoodModel.findByPk(food_id);
      await foodRes.increment('favs', { transaction: t });
    });
  }
  // 取消点赞菜品
  static async dislike(uid: number, food_id: string) {
    const res = await FoodLikesModel.findOne({ where: { uid, food_id } });
    if (!res) throw new ErrorResponse(ERR_CODE[5104]);

    // 事务: [点赞表删除一条数据, 菜品表favs字段-1]
    return sequelize.transaction(async t => {
      await res.destroy({ force: true, transaction: t });

      const foodRes = await FoodModel.findByPk(food_id);
      await foodRes.decrement('favs', { transaction: t });
    });
  }
}
FoodLikesModel.init(
  {
    uid: {
      type: DataTypes.INTEGER,
      comment: '用户id',
    },
    food_id: {
      type: DataTypes.STRING,
      comment: '菜品id',
    },
  },
  {
    sequelize,
    tableName: 'food_likes',
  }
);

export { FoodLikesModel };
