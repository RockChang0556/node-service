/*
 * @Author: Rock Chang
 * @Date: 2022-01-07 10:39:34
 * @LastEditTime: 2022-01-07 10:48:13
 * @Description: 工具类方法
 */

import { objProp } from '@/types/query';

export const removeEmpty = function (obj: objProp): objProp {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};
