import mysql from 'mysql';
import { DATABASE as db } from '@/constant/config';
import { Forbidden } from '@/core/http-exception';

// 数据库查询方法
const query = (sql, values) => {
  const pool = mysql.createPool({
    host: db.HOST,
    port: db.PORT,
    user: db.USER,
    password: db.PASSWORD,
    database: db.DBNAME,
    connectionLimit: db.CONNECTION_LIMIT,
    multipleStatements: true, // 允许执行多条查询语句
  });
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(new Forbidden('数据库连接失败'));
      } else {
        connection.query(sql, values, (err, rows) => {
          connection.release();
          if (err) {
            return reject(new Forbidden('数据库操作失败'));
          } else {
            return resolve(rows);
          }
        });
      }
    });
  });
};

export { query };
