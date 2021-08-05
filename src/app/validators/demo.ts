/*
 * @Author: Rock Chang
 * @Date: 2021-04-26 16:03:58
 * @LastEditTime: 2021-05-19 11:14:52
 * @Description: 参数校验 - demo
 */
import { Validator, Rule } from '@/core/validator';
class PositiveIntValidator extends Validator {
  id: Rule[];
  constructor() {
    super();
    this.id = [new Rule('isInt', 'id必须为正整数', { min: 1 })];
  }
}

export { PositiveIntValidator };
