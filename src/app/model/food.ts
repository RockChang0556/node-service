/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-26 19:51:21
 * @Description: chang/菜单相关 model
 * 实体表 - food
 */
import Sequelize, { Model, Op, DataTypes } from 'sequelize';
import { sequelize } from '@/core/db';
import { objProp, pqoParamsProp } from '@/types/query';
import { formatQ2S, parseJSON } from '@/utils/utils';
import { FoodLikesModel, UserModel } from '.';

class FoodModel extends Model {
  /**
   * and 查询
   * 如参数是 {a: 1, b: 2}, 会查询 a=1&b=2 的数据
   * @param {*} val 值
   */
  static async getOne(obj) {
    const getRes = await FoodModel.findOne({
      where: obj,
    });
    return getRes;
  }
  /** 获取菜品详情
   * @param {*} val 值
   */
  static async getDetail(obj) {
    const getRes = await FoodModel.findOne({
      where: obj,
      attributes: {
        exclude: ['uid'],
      },
      include: {
        model: UserModel,
        as: 'creator',
        attributes: {
          exclude: [
            'created_at',
            'deleted_at',
            'updated_at',
            'admin',
            'sign_count',
            'password',
          ],
        },
      },
    });
    return getRes;
  }
  /** 分页模糊查询所有数据
   * @param {*} userid 用户id, 判断是否点赞用
   * @param {*} querys 查询公共参数
   * @param {*} obj 其他 where 限制参数
   */
  static async getAll(userid: string, querys: pqoParamsProp, obj?: objProp) {
    const { query, order, offset, limit } = formatQ2S(querys);
    // 查询参数处理
    const where: any[] = obj ? [obj] : [];
    if (query) {
      where.push(...query);
    }
    const res = await FoodModel.findAndCountAll({
      where: {
        [Op.and]: where,
      },
      order,
      offset,
      limit,
      attributes: ['id', 'name', 'pic', 'content', 'favs', 'tag'],
    });
    // 用户喜欢的所有菜品
    const likes = (
      await FoodLikesModel.findAll({ where: { uid: userid } })
    ).map((v: any) => v.food_id);
    // 设置 islike 字段
    res.rows.forEach((v: any) => {
      if (likes.includes(v.id)) {
        v.setDataValue('islike', true);
      }
    });
    return res;
  }
}

FoodModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true, // 主键
      defaultValue: Sequelize.UUIDV4,
      comment: 'id,唯一,自增',
    },
    uid: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: '创建者id',
    },
    name: {
      type: DataTypes.STRING,
      comment: '菜品名称',
    },
    pic: {
      type: DataTypes.STRING,
      comment: '菜品图片',
    },
    content: {
      type: DataTypes.TEXT,
      comment: '菜品说明',
    },
    favs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '点赞数量',
    },
    peoplenum: {
      type: DataTypes.STRING,
      comment: '用餐人数',
    },
    cookingtime: {
      type: DataTypes.STRING,
      comment: '烹饪时间',
    },
    tag: {
      type: DataTypes.STRING,
      comment: '标签，逗号分隔,如 ‘减肥,家常菜,排毒,补钙’',
      set(val: string[]) {
        const value = val?.length ? val : [];
        this.setDataValue('tag', value.join(','));
      },
      get() {
        const rawValue = this.getDataValue('tag');
        return rawValue ? rawValue.split(',') : [];
      },
    },
    material: {
      type: DataTypes.TEXT,
      comment: '材料',
      set(val: any) {
        this.setDataValue('material', JSON.stringify(val));
      },
      get() {
        const rawValue = this.getDataValue('material');
        return parseJSON(rawValue);
      },
    },
    process: {
      type: DataTypes.TEXT,
      comment: '步骤',
      set(val: any) {
        this.setDataValue('process', JSON.stringify(val));
      },
      get() {
        const rawValue = this.getDataValue('process');
        return parseJSON(rawValue);
      },
    },
  },
  {
    sequelize,
    tableName: 'food',
  }
);

export { FoodModel };
