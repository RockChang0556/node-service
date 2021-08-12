/*
 * @Author: Rock Chang
 * @Date: 2021-04-27 23:06:11
 * @LastEditTime: 2021-08-11 19:54:16
 * @Description: 数据库连接
 */
// const { Sequelize, Model } = require('sequelize');
// const { HOST, PORT, USER, PASSWORD, DBNAME } =
//   require('@/config/config.js').DATABASE;

// const sequelize = new Sequelize(DBNAME, USER, PASSWORD, {
//   dialect: 'mysql',
//   host: HOST,
//   port: PORT,
//   logging: true,
//   timezone: '+08:00',
//   define: {
//     //create_time  update_time delete_time
//     timestamps: true,
//     paranoid: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//     deletedAt: 'deleted_at',
//     underscored: true,
//     freezeTableName: true,
//     scopes: {
//       bh: {
//         attributes: {
//           exclude: ['updated_at', 'deleted_at', 'created_at'],
//         },
//       },
//     },
//   },
// });

// sequelize.sync({
//   force: false,
// });

// module.exports = {
//   sequelize,
// };
