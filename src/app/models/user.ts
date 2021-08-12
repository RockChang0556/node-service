/*
 * @Author: Rock Chang
 * @Date: 2021-04-30 17:28:33
 * @LastEditTime: 2021-08-12 10:03:45
 * @Description: 数据库操作 - user
 */

import { query } from '@/utils/query';
import { ErrorResponse } from '@/core/http-exception';

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   admin: number;
//   password?: string;
// }

class User {
  /** 根据 id 查询用户信息
   * @param {*} id
   * @return {*}
   */
  async getUserById(id) {
    const res: any = await query(
      `SELECT id,name,email,phone,admin FROM user WHERE id = ?`,
      [id]
    );
    if (!res.length) {
      throw new ErrorResponse('获取用户信息失败!');
    } else {
      return res[0];
    }
  }
  /**
   * 根据key和val查用户信息
   * @param {*} val 值
   * @param {string|string[]} key 查找的key
   */
  async getUser(val, key: string | string[]) {
    let res = null;
    if (Array.isArray(key)) {
      const sql: string = key.join(' = ? OR ') + ' = ?';
      const valList = new Array(key.length).fill(val);
      res = await query(`SELECT * FROM user WHERE (${sql})`, valList);
    } else {
      res = await query(`SELECT * FROM user WHERE ${key || 'id'} = ?`, [val]);
    }
    return res;
  }
  // 添加用户
  async addUser(data) {
    const res: any = await query(`INSERT INTO user SET ?`, [data]);
    return res;
  }
}

export { User };
