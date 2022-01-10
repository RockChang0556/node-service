/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-10 11:18:03
 * @Description: chang/心愿单相关 model
 */
import { Model, Op, DataTypes } from 'sequelize';
import { sequelize } from '@/core/db';
import { objProp, pqoParamsProp } from '@/types/query';
import { formatQ2S } from '@/utils/utils';
class WishModel extends Model {
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
    food_list: {
      type: DataTypes.TEXT,
      comment: '菜品id列表，逗号分隔',
    },
  },
  {
    sequelize,
    tableName: 'wish',
  }
);

export { WishModel };
