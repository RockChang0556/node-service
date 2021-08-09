import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import { JWT, DATABASE as db } from '@/constant/config';
import { Forbidden } from '@/core/http-exception';

// 生成jwt令牌
const generateToken = (data: any) => {
  const token = jwt.sign(data, JWT.SECRET_KEY, {
    expiresIn: JWT.EXPIRE_IN,
  });
  return token;
};

// 数据库查询方法
const query = (sql, values) => {
  const pool = mysql.createPool({
    host: db.HOST,
    port: db.PORT,
    user: db.USER,
    password: db.PASSWORD,
    database: db.DBNAME,
    connectionLimit: db.CONNECTION_LIMIT,
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

export { generateToken, query };
