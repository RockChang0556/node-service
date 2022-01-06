/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-06 11:39:25
 * @Description: 用户相关 model
 */
import Sequelize, { Model } from 'sequelize';
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
//   type: Sequelize.INTEGER,
//   primaryKey: true, // 主键
//   autoIncrement: true, // 自增
//   unique: true, // 唯一
//   comment: '这是备注',
//   validate: { // 校验 https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/core-concepts/validations-and-constraints.md#%E9%AA%8C%E8%AF%81%E5%99%A8
//     is: /^[a-z]+$/i,
//   }
// },
UserModel.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: '用户id,唯一,自增',
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      comment: '用户name,唯一',
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: '用户email,唯一',
    },
    phone: {
      type: Sequelize.STRING,
      unique: true,
      comment: '用户phone,唯一',
    },
    password: {
      type: Sequelize.STRING,
      comment: '用户密码',
      set(val: string) {
        const salt = bcrypt.genSaltSync(10);
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue('password', psw);
      },
    },
    avatar_id: {
      type: Sequelize.STRING,
      comment: '用户头像id',
    },
    avatar_url: {
      type: Sequelize.STRING,
      comment: '用户头像url',
    },
    admin: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '用户级别,0普通用户，1只读，2可编辑，3可删除，5超管',
    },
    position: {
      type: Sequelize.STRING,
      comment: '职位',
    },
    summary: {
      type: Sequelize.STRING,
      comment: '个人简介',
    },
    sex: {
      type: Sequelize.INTEGER,
      defaultValue: -1,
      validate: {
        isIn: [[-1, 0, 1]], // 检查值是其中之一
      },
      comment: '性别，-1-保密，0-女， 1-男',
    },
    favs: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: '用户积分',
    },
    sign_count: {
      type: Sequelize.INTEGER,
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
