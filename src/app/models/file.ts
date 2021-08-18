/*
 * @Author: Rock Chang
 * @Date: 2021-08-17 14:45:28
 * @LastEditTime: 2021-08-17 15:34:02
 * @Description: 数据库操作 - file
 */

import { query } from '@/utils/query';

class File {
  /** 添加文件
   * @param {*} data
   * @return {*}
   */
  async addFile(data) {
    const res: any = await query(`INSERT INTO file SET ?`, [data]);
    return res;
  }

  /** 查询文件信息,
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
}

export { File };
