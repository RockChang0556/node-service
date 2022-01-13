/*
 * @Author: Rock Chang
 * @Date: 2022-01-13 15:48:40
 * @LastEditTime: 2022-01-13 15:53:52
 * @Description: 参数校验 = 菜品
 */

import { Validator, Rule } from '@/core/validator';
class LimitIntValidator extends Validator {
  limit: Rule[];
  constructor() {
    super();
    this.limit = [
      new Rule('isInt', 'limit必须为正整数', { min: 1 }),
      new Rule('isOptional'), // 可选参数
    ];
  }
}

export { LimitIntValidator };
