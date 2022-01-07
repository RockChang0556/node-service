/*
 * @Author: Rock Chang
 * @Date: 2022-01-06 14:48:46
 * @LastEditTime: 2022-01-07 10:44:46
 * @Description: 接口参数定义
 */

// 分页参数  page_index 起始页数 page_size 分页大小
export interface pagesProp {
  page_index: number;
  page_size: number;
}
// 模糊查询参数 查询字段: 查询关键字
export interface querysProp {
  [x: string]: string;
}
// 排序参数 [key] 排序字段 : 'desc'-从大到小 | 'asc'-从小到大
export interface ordersProp {
  [x: string]: 'desc' | 'asc';
}

export interface objProp {
  [x: string]: any;
}
