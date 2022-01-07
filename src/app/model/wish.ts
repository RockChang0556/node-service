/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-07 11:42:09
 * @Description: 文件相关 model
 */
import { sequelize } from '@/core/db';
import { ordersProp, pagesProp, querysProp } from '@/types/query';
import { formatQ2S } from '@/utils/utils';
import Sequelize, { Model, Op } from 'sequelize';

class WishModel extends Model {
  /**
   * 根据key和val查用户信息
   * @param {*} val 值
   * @param {string|string[]} key 查找的key
   */
  static async getOne(obj) {
    const getRes = await WishModel.findOne({
      where: obj,
    });
    return getRes;
  }

  /** 分页模糊查询当前用户名下所有数据
   * @param {*}
   * @return {*}
   */
  static async getAll(
    uid: number,
    pages?: pagesProp,
    querys?: querysProp,
    orders?: ordersProp
  ) {
    const { query, order, offset, limit } = formatQ2S(pages, querys, orders);
    // 查询参数处理
    const where: any[] = [{ uid: uid }];
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
      // attributes: { exclude: ['deleted_at'] },
    });
    return res;
  }
}

WishModel.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: 'id,唯一,自增',
    },
    uid: {
      type: Sequelize.STRING,
      comment: '创建者id',
    },
    name: {
      type: Sequelize.STRING,
      comment: '心愿单名称',
    },
    summary: {
      type: Sequelize.TEXT,
      defaultValue: '暂无描述',
      comment: '心愿单描述',
    },
    tag: {
      type: Sequelize.STRING,
      comment: '标签，逗号分隔',
    },
    food_list: {
      type: Sequelize.TEXT,
      comment: '菜品id列表',
    },
  },
  {
    sequelize,
    tableName: 'wish',
  }
);

export { WishModel };
