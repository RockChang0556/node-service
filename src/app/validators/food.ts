/*
 * @Author: Rock Chang
 * @Date: 2022-01-13 15:48:40
 * @LastEditTime: 2022-01-25 16:55:15
 * @Description: 参数校验 = 菜品
 */

import { Validator, Rule } from '@/core/validator';
import { PositiveIntValidator } from './demo';

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

class LikesValidator extends PositiveIntValidator {
  constructor() {
    super();
  }
  validateType(req) {
    if (!['like', 'dislike'].includes(req.body.type)) {
      return [false, '参数错误, type只能为like、dislike'];
    }
    return true;
  }
}

export { LimitIntValidator, LikesValidator };
