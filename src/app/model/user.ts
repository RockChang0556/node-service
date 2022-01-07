/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-07 15:03:40
 * @Description: 用户相关 model
 */
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '@/core/db';

class UserModel extends Model {
  static async getUserByOpenid(openid) {
    const user = await UserModel.findOne({
      where: {
        openid,
      },
    });
    return user;
  }
  /**
   * 根据key和val查用户信息
   * @param {*} val 值
   * @param {string|string[]} key 查找的key
   */
  static async getUser(val: any, key = 'id') {
    const user = await UserModel.findOne({
      where: {
        [key]: val,
      },
      attributes: { exclude: ['password'] },
    });
    return user;
  }
  /** 获取列表
   * @param {object} querys 模糊查询参数
   * @param {object} orders 排序参数
   * @param {object} pages 分页参数
   * @return {*}
   */
  static async getAll(querys = {}, orders = {}, pages) {
    console.log('getAll', { querys, orders, pages });
    // 分页参数兼容性处理
    // const page_index = (pages?.page_index > 1 && pages.page_index) || 1;
    // const page_size = (pages?.page_size > 1 && pages.page_size) || 10; // page_size存在并且大于1,取page_size,否则取10
    const user = await UserModel.findAll();
    return user;
  }
  static async getAllPath() {
    const user = await UserModel.findAll();
    return user;
  }
}

// id: {
//   type: DataTypes.INTEGER,
//   primaryKey: true, // 主键
//   autoIncrement: true, // 自增
//   unique: true, // 唯一
//   defaultValue: 0, // 默认值
//   comment: '这是备注',
//   validate: { // 校验 https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/core-concepts/validations-and-constraints.md#%E9%AA%8C%E8%AF%81%E5%99%A8
//     is: /^[a-z]+$/i,
//   }
// },
UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: '用户id,唯一,自增',
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      comment: '用户name,唯一',
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: '用户email,唯一',
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      comment: '用户phone,唯一',
    },
    password: {
      type: DataTypes.STRING,
      comment: '用户密码',
      set(val: string) {
        const salt = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue('password', psw);
      },
    },
    avatar_id: {
      type: DataTypes.STRING,
      comment: '用户头像id',
    },
    avatar_url: {
      type: DataTypes.STRING,
      comment: '用户头像url',
    },
    admin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '用户级别,0普通用户，1只读，2可编辑，3可删除，5超管',
    },
    position: {
      type: DataTypes.STRING,
      comment: '职位',
    },
    summary: {
      type: DataTypes.STRING,
      comment: '个人简介',
    },
    sex: {
      type: DataTypes.INTEGER,
      defaultValue: -1,
      validate: {
        isIn: [[-1, 0, 1]], // 检查值是其中之一
      },
      comment: '性别，-1-保密，0-女， 1-男',
    },
    favs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '用户积分',
    },
    sign_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '签到次数',
    },
  },
  {
    sequelize,
    tableName: 'user',
  }
);

export { UserModel };
