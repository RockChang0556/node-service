/*
 * @Author: Rock Chang
 * @Date: 2021-04-28 14:51:58
 * @LastEditTime: 2021-05-19 11:15:32
 * @Description: 参数校验 - user
 */

import { Validator, Rule } from '@/core/validator';

class LoginValidator extends Validator {
  email: Rule[];
  password: Rule[];
  constructor() {
    super();
    this.email = [new Rule('isEmail', '邮箱格式不正确')];
    this.password = [
      new Rule('isLength', '密码最少6个字符, 最多32字符', { min: 6, max: 32 }),
    ];
  }
}

export { LoginValidator };
