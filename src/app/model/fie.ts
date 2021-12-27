/*
 * @Author: Rock Chang
 * @Date: 2021-12-21 20:23:26
 * @LastEditTime: 2021-12-27 13:10:16
 * @Description: 文件相关 model
 */
import { sequelize } from '@/core/db';
const { Sequelize, Model } = require('sequelize');

class FileModel extends Model {}

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
