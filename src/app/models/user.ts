/*
 * @Author: Rock Chang
 * @Date: 2021-04-30 17:28:33
 * @LastEditTime: 2021-08-12 19:36:45
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
  /** 添加用户
   * @param {*} data 用户信息
   * @return {*}
   */
  async addUser(data) {
    const res: any = await query(`INSERT INTO user SET ?`, [data]);
    return res;
  }
  /** 更新用户信息
   * @param {number} id 用户id
   * @param {*} data 要更新的数据
   * @return {*}
   */
  async updateUser(id: number, data) {
    const arr = Object.keys(data).map(key => {
      return `${key}='${data[key]}'`;
    });
    const res: any = await query(
      `UPDATE user SET ${arr.join(',')} WHERE id=?;`,
      [id]
    );
    return res;
  }
  /** 邮箱重置密码
   * @param {string} email
   * @param {string} new_pass
   * @return {*}
   */
  async updatePassword(email: string, new_pass: string) {
    const res: any = await query(`UPDATE user SET password=? WHERE email=?;`, [
      new_pass,
      email,
    ]);
    return res;
  }

  /** 添加邮箱验证码, 邮箱为主键, 没有则添加, 有则更新验证码
   * @param {object} data
   * @return {*}
   */
  async addEmailCode(data: { email: string; code: string; expire_time: Date }) {
    const res: any = await query(`REPLACE INTO email_code SET ?`, [data]);
    return res;
  }
  // 删除验证码
  async deleteEmailCode(email: string) {
    const res: any = await query(`DELETE FROM email_code WHERE email=?`, [
      email,
    ]);
    return res;
  }
  // 获取验证码
  async getEmailCode(email: string) {
    const res: any = await query(`SELECT * FROM email_code WHERE email=?`, [
      email,
    ]);
    return res;
  }
}

export { User };
