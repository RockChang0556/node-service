/*
 * @Author: Rock Chang
 * @Date: 2021-04-28 14:51:58
 * @LastEditTime: 2021-08-08 18:58:26
 * @Description: 参数校验 - user
 */

import { Validator, Rule } from '@/core/validator';

class LoginValidator extends Validator {
  account: Rule[];
  password: Rule[];
  constructor() {
    super();
    // this.account = [new Rule('isEmail', '邮箱格式不正确')];
    this.password = [
      new Rule('isLength', '密码最少6个字符, 最多32字符', { min: 6, max: 32 }),
    ];
  }
}

export { LoginValidator };
