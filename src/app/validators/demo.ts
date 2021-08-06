/*
 * @Author: Rock Chang
 * @Date: 2021-04-26 16:03:58
 * @LastEditTime: 2021-08-06 11:52:19
 * @Description: 参数校验 - demo
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

export { PositiveIntValidator };
