/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2022-01-05 16:10:35
 * @Description: 文件相关 model
 */
import { sequelize } from '@/core/db';
const { Sequelize, Model } = require('sequelize');

class FileModel extends Model {
  /**
   * 根据key和val查用户信息
   * @param {*} val 值
   * @param {string|string[]} key 查找的key
   */
  static async getOne(val: any, key: string = 'id') {
    const user = await FileModel.findOne({
      where: {
        [key]: val,
      },
      attributes: { exclude: ['password'] },
    });
    return user;
  }
  static async getAll(querys = {}, orders = {}, pages) {
    console.log('getAll', { querys, orders, pages });
    // 分页参数兼容性处理
    // const page_index = (pages?.page_index > 1 && pages.page_index) || 1;
    // const page_size = (pages?.page_size > 1 && pages.page_size) || 10; // page_size存在并且大于1,取page_size,否则取10
    const user = await FileModel.findAll();
    return user;
  }
}

FileModel.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, // 主键
      autoIncrement: true, // 自增
      comment: 'id,唯一,自增',
    },
    filename: {
      type: Sequelize.STRING,
      comment: '文件名字',
    },
    filetype: {
      type: Sequelize.STRING,
      comment: '文件类型',
    },
    originalname: {
      type: Sequelize.STRING,
      comment: '文件原始名字， 上传前的名字',
    },
    path: {
      type: Sequelize.STRING,
      comment: '文件地址',
    },
    size: {
      type: Sequelize.INTEGER,
      comment: '文件大小',
    },
    md5: {
      type: Sequelize.STRING,
      comment: '文件的md5',
    },
    fieldname: {
      type: Sequelize.STRING,
      comment: '未知',
    },
    encoding: {
      type: Sequelize.STRING,
      comment: '未知',
    },
  },
  {
    sequelize,
    tableName: 'file',
  }
);

export { FileModel };
