/*
 * @Author: Rock Chang
 * @Date: 2021-04-26 16:03:58
 * @LastEditTime: 2022-01-06 17:38:59
 * @Description: 参数校验 - demo
 * https://doc.cms.talelin.com/server/koa/validator.html#%E7%B1%BB%E6%A0%A1%E9%AA%8C
 */
import { Validator, Rule } from '@/core/validator';
class PositiveIntValidator extends Validator {
  id: Rule[];
  constructor() {
    super();
    this.id = [
      new Rule('isInt', 'id必须为正整数', { min: 1 }),
      // new Rule('isOptional'), // 可选参数
    ];
  }
}

export { PositiveIntValidator, Validator };
