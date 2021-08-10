/*
 * @Author: Rock Chang
 * @Date: 2021-04-28 14:51:58
 * @LastEditTime: 2021-08-10 10:44:16
 * @Description: 参数校验 - user
 */

import { Validator, Rule } from '@/core/validator';

class PassValidator extends Validator {
  password: Rule[];
  constructor() {
    super();
    this.password = [
      new Rule('isNotEmpty', '密码不可为空'),
      new Rule(
        'matches',
        '密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
        /^[a-zA-Z]\w{5,17}$/
      ),
    ];
  }
}

class LoginValidator extends PassValidator {
  account: Rule[];
  constructor() {
    super();
    this.account = [
      new Rule('isNotEmpty', '账号不可为空'),
      new Rule(
        'matches',
        '手机/邮箱格式不正确',
        /(^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$)|(^1[3|4|5|7|8]\d{9}$)/
      ),
    ];
  }
}
class RegisterValidator extends PassValidator {
  name: Rule[];
  email: Rule[];
  confirm_password: Rule;
  constructor() {
    super();
    this.name = [
      new Rule('isNotEmpty', '昵称不可为空'),
      new Rule('isLength', '昵称长度必须在2~16之间', 2, 16),
    ];
    this.email = [
      new Rule('isNotEmpty', '账号不可为空'),
      new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱'),
    ];
    this.confirm_password = new Rule('isNotEmpty', '确认密码不可为空');
  }
  // 自定义规则函数, 必须 validate 开头
  validateConfirmPassword(data) {
    if (!data.body.password || !data.body.confirm_password) {
      return [false, '两次输入的密码不一致，请重新输入'];
    }
    let ok = data.body.password === data.body.confirm_password;
    if (ok) {
      return ok;
    } else {
      return [false, '两次输入的密码不一致，请重新输入'];
    }
  }
}
export { LoginValidator, RegisterValidator };
