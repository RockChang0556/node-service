/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 14:45:28
 * @LastEditTime: 2021-08-19 00:19:06
 * @Description: 数据库操作 - file
 */

import { query } from '@/utils/query';
import { sqlAll } from './common';

class File {
  /** 添加文件
   * @param {*} data
   * @return {*}
   */
  async addFile(data) {
    const res: any = await query(`INSERT INTO file SET ?`, [data]);
    return res;
  }

  /** 查询指定文件信息,
   * @param {string} key 如 md5, id
   * @return {string} val 值
   */
  async getFile(key, val) {
    const res: any = await query(
      `SELECT * FROM file WHERE ${key || 'id'} = ?`,
      [val]
    );
    return res;
  }

  /** 获取所有文件信息
   * @param {object} querys 模糊查询参数
   * @param {object} orders 排序参数
   * @param {object} pages 分页参数
   * @return {*}
   */
  async getAll(querys = {}, orders = {}, pages) {
    const res = await sqlAll('file', querys, orders, pages);
    return res;
  }
}

export { File };
