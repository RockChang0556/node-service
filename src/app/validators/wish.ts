/*
 * @Author: Rock Chang
 * @Date: 2021-04-26 16:03:58
 * @LastEditTime: 2022-01-13 15:48:19
 * @Description: 参数校验 - 心愿单
 * https://doc.cms.talelin.com/server/koa/validator.html#%E7%B1%BB%E6%A0%A1%E9%AA%8C
 */
import { PositiveIntValidator } from './demo';

class NameIdValidator extends PositiveIntValidator {
  constructor() {
    super();
  }
  validateName(data) {
    if (!data.body.name?.trim()) {
      return [false, '名称不可为空或只含空格'];
    }
    return true;
  }
}
class UpdatefoodValidator extends PositiveIntValidator {
  constructor() {
    super();
  }
  validateType(data) {
    if (!['add', 'delete'].includes(data.body.type)) {
      return [false, '参数错误, type只能为add、delete'];
    }
    return true;
  }
  validateFoodIds(data) {
    if (!Array.isArray(data.body.food_ids)) {
      return [false, '参数错误, food_ids必须为数组'];
    }
    return true;
  }
}

export { NameIdValidator, UpdatefoodValidator };
