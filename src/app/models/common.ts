/*
 * @Author: Rock Chang
 * @Date: 2021-08-19 00:04:23
 * @LastEditTime: 2021-08-19 00:52:27
 * @Description: model层的公共方法抽离
 */
import { query } from '@/utils/query';

/** 模糊查询 排序 分页 获取所有信息
 * @param {string} db 查询的表名
 * @param {object} querys 模糊查询参数
 * [key] 查询字段: 查询关键字
 * @param {object} pages 分页参数
 * page_index 起始页数
 * page_size 分页大小
 * @param {object} orders 排序参数
 * [key] 排序字段 : 'desc'-从大到小 | 'asc'-从小到大
 * @return {*}
 */
/* 
{
  "pages": { "page_index": 1, "page_size": 5 },
  "querys": { "name": "peng" },
  "orders": { "admin": "asc" }
}
*/
export async function sqlAll(
  db: string,
  querys?: { [key: string]: string },
  orders?: { [key: string]: 'desc' | 'asc' },
  pages?: { page_index: number; page_size: number }
) {
  // 分页参数兼容性处理
  const page_index = (pages?.page_index > 1 && pages.page_index) || 1;
  const page_size = (pages?.page_size > 1 && pages.page_size) || 10; // page_size存在并且大于1,取page_size,否则取10
  // 模糊查询参数转sql
  let querysql = '';
  if (querys && Object.keys(querys).length) {
    const key = Object.keys(querys)[0];
    querysql = `where ${key} REGEXP '${querys[key]}'`;
  }
  // 排序参数转sql
  let ordersql = '';
  if (orders && Object.keys(orders).length) {
    ordersql = Object.keys(orders)
      .map(v => `${v} ${orders[v]}`)
      .join(',');
    ordersql = `order by ${ordersql}`;
  }
  const res: any = await query(
    `SELECT SQL_CALC_FOUND_ROWS * FROM ${db} ${querysql} ${ordersql} limit ?,?; SELECT FOUND_ROWS() as total;`,
    [(page_index - 1) * page_size, page_size]
  );
  return {
    pages: { page_index, page_size, page_total: res[1][0].total },
    row: res[0],
  };
}
