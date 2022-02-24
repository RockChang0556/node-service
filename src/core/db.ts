/*
 * @Author: Rock Chang
 * @Date: 2021-04-27 23:06:11
 * @LastEditTime: 2022-02-24 16:38:10
 * @Description: 数据库连接
 */
import { DATABASE } from '@/constant/config';
import { Sequelize } from 'sequelize';

const { HOST, PORT, USER, PASSWORD, DBNAME } = DATABASE;

const sequelize = new Sequelize(DBNAME, USER, PASSWORD, {
  dialect: 'mysql',
  host: HOST,
  port: PORT,
  logging: false, // 执行sql时是否在控制台输出
  timezone: '+08:00',
  // query: { raw: true }, // 只查询dataValues
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

// 注意!!!  修改 Model 的原型,会导致squelize的get和set失效, 原因未知
// Model.prototype.toJSON = function () {
//   // let data = this.dataValues
//   const data = clone(this.dataValues);

//   // 自定义包含字段, 默认排除三种
//   // const del = ['created_at', 'updated_at', 'deleted_at'];
//   // if (isArray(this.includes)) {
//   //   del.forEach(value => {
//   //     if (!this.includes.includes(value)) {
//   //       unset(data, value);
//   //     }
//   //   });
//   // } else {
//   //   del.forEach(value => {
//   //     unset(data, value);
//   //   });
//   // }
//   unset(data, 'deleted_at');

//   for (const key in data) {
//     if (key === 'image') {
//       if (!data[key].startsWith('http'))
//         data[key] = global.config.host + data[key];
//     }
//   }

//   // 自定义排除字段
//   /*
//     例子1: model/user.ts    UserModel.prototype.exclude = ['book_id','id']
//     例子2(推荐): api/user.ts    userRes.exclude = ['book_id','id']
//   */
//   if (isArray(this.exclude)) {
//     this.exclude.forEach(value => {
//       unset(data, value);
//     });
//   }
//   return data;
// };

sequelize
  .authenticate()
  .then(result => {
    console.log('Connection has been established successfully', result);
  })
  .catch(err => {
    console.error('Unable to connect to the database', err);
  });

export { sequelize };
