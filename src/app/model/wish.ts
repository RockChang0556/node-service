/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-18 21:18:35
 * @Description:  chang/心愿单相关 model
 * 实体表 - wish
 */
import { Model, Op, DataTypes } from 'sequelize';
import { sequelize } from '@/core/db';
import { objProp, pqoParamsProp } from '@/types/query';
import { formatQ2S } from '@/utils/utils';
import { FoodModel, WishFoodModel } from '.';
class WishModel extends Model {
  /**
   * 更新心愿单下菜品
   * @param {*} val 值
   */
  static async updateFoods(id, type, food_ids) {
    // 添加菜品
    if (type === 'add') {
      for (let index = 0; index < food_ids.length; index++) {
        const v = food_ids[index];
        // 兼容处理 避免报错
        const havFood = await FoodModel.findByPk(v);
        if (!havFood) continue;
        const havWishFood = await WishFoodModel.findOne({
          where: { wish_id: id, food_id: v },
        });
        if (havWishFood) continue;
        await WishFoodModel.create({ wish_id: id, food_id: v });
      }
      // 删除菜品
    } else if (type === 'delete') {
      for (let index = 0; index < food_ids.length; index++) {
        const v = food_ids[index];
        await WishFoodModel.destroy({
          where: { wish_id: id, food_id: v },
          force: true,
        });
      }
    }
  }
  /**
   * and 查询
   * 如参数是 {a: 1, b: 2}, 会查询 a=1&b=2 的数据
   * @param {*} val 值
   */
  static async getOne(obj) {
    const getRes = await WishModel.findOne({
      where: obj,
    });
    return getRes;
  }

  /** 分页模糊查询所有数据
   * @param {*} querys 查询公共参数
   * @return {*} obj 其他 where 限制参数
   */
  static async getAll(querys: pqoParamsProp, obj: objProp) {
    const { query, order, offset, limit } = formatQ2S(querys);
    // 查询参数处理
    const where: any[] = obj ? [obj] : [];
    if (query) {
      where.push(...query);
    }
    const res = await WishModel.findAndCountAll({
      where: {
        [Op.and]: where,
      },
      order,
      offset,
      limit,
      include: {
        model: FoodModel,
        as: 'food_list',
        through: {
          // 去除联结模型的所有属性
          attributes: [],
        },
        attributes: ['id', 'uid', 'name', 'pic'],
      },
      // attributes: { exclude: ['deleted_at'] },
    });
    return res;
  }
}

WishModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: 'id,唯一,自增',
    },
    uid: {
      type: DataTypes.INTEGER,
      comment: '创建者id',
    },
    name: {
      type: DataTypes.STRING,
      comment: '心愿单名称',
    },
    summary: {
      type: DataTypes.TEXT,
      comment: '心愿单描述',
    },
    tag: {
      type: DataTypes.STRING,
      comment: '标签，逗号分隔',
      set(val: string[]) {
        const value = val?.length ? val : [];
        this.setDataValue('tag', value.join(','));
      },
      get() {
        const rawValue = this.getDataValue('tag');
        return rawValue ? rawValue.split(',') : [];
      },
    },
  },
  {
    sequelize,
    tableName: 'wish',
  }
);

export { WishModel };
