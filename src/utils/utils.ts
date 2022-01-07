/*
 * @Author: Rock Chang
 * @Date: 2022-01-07 10:39:34
 * @LastEditTime: 2022-01-07 11:41:04
 * @Description: 工具类方法
 */
import { Op } from 'sequelize';
import { objProp, ordersProp, pagesProp, querysProp } from '@/types/query';

// 移除对象中值为 null 或 undefined 的属性
export const removeEmpty = function (obj: objProp): objProp {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

// 将分页查询参数处理成 squelize 需要的格式
export const formatQ2S = function (
  pages?: pagesProp,
  querys?: querysProp,
  orders?: ordersProp
) {
  // 分页参数兼容性处理
  const page_index = (pages?.page_index > 1 && pages.page_index) || 1;
  const page_size = (pages?.page_size > 1 && pages.page_size) || 10; // page_size存在并且大于1,取page_size,否则取10
  // 查询参数处理
  const query: any[] = [];
  if (querys) {
    const queryss = Object.keys(querys).map((v: string) => {
      return { [v]: { [Op.substring]: querys[v] } };
    });
    query.push(...queryss);
  }
  // 排序处理
  const order = [];
  if (orders) {
    const orderss = Object.keys(orders).map((v: string) => {
      const o = orders[v] === 'desc' ? 'desc' : 'asc';
      return [v, o];
    });
    order.push(orderss[0]);
  }
  return {
    query,
    order: order,
    offset: (page_index - 1) * page_size,
    limit: page_size,
  };
};
