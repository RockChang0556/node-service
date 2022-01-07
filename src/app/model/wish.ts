/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-07 11:15:58
 * @Description: 文件相关 model
 */
import { sequelize } from '@/core/db';
import { ordersProp, pagesProp, querysProp } from '@/types/query';
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
  static async getAll(
    uid: number,
    pages?: pagesProp,
    querys?: querysProp,
    orders?: ordersProp
  ) {
    // 分页参数兼容性处理
    const page_index = (pages?.page_index > 1 && pages.page_index) || 1;
    const page_size = (pages?.page_size > 1 && pages.page_size) || 10; // page_size存在并且大于1,取page_size,否则取10
    // 查询参数处理
    const where: any[] = [{ uid: uid }];
    if (querys) {
      const queryss = Object.keys(querys).map((v: string) => {
        return { [v]: { [Op.substring]: querys[v] } };
      });
      where.push(...queryss);
    }
    // 排序处理
    const order = [];
    if (orders) {
      const orderss = Object.keys(orders).map((v: string) => {
        const o = orders[v] === 'desc' ? 'desc' : 'asc';
        return [v, o];
      });
      order.push(orderss[0]);
    }
    const res = await WishModel.findAndCountAll({
      where: {
        [Op.and]: where,
      },
      order: order,
      offset: (page_index - 1) * page_size,
      limit: page_size,
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
