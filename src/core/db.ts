/*
 * @Author: Rock Chang
 * @Date: 2021-04-27 23:06:11
 * @LastEditTime: 2021-12-22 11:52:01
 * @Description: 数据库连接
 */
import { DATABASE } from '@/constant/config';
import { clone, unset } from 'lodash';
const { Sequelize, Model } = require('sequelize');

const { HOST, PORT, USER, PASSWORD, DBNAME } = DATABASE;
const sequelize = new Sequelize(DBNAME, USER, PASSWORD, {
  dialect: 'mysql',
  host: HOST,
  port: PORT,
  logging: false, // 执行sql时是否在控制台输出
  timezone: '+08:00',
  query: { raw: true }, // 只查询dataValues
  define: {
    //create_time  update_time delete_time
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    freezeTableName: true,
    scopes: {
      bh: {
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at'],
        },
      },
    },
  },
});

sequelize.sync({
  force: false, // 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
});
Model.prototype.toJSON = function () {
  // let data = this.dataValues
  let data = clone(this.dataValues);
  // unset(data, 'created_at');
  // unset(data, 'deleted_at');

  // if (isArray(this.exclude)) {
  //   this.exclude.forEach(value => {
  //     unset(data, value);
  //   });
  // }
  return data;
};

sequelize
  .authenticate()
  .then(result => {
    console.log('Connection has been established successfully', result);
  })
  .catch(err => {
    console.error('Unable to connect to the database', err);
  });

export { sequelize };
