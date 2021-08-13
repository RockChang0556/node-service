/*
 * @Author: Rock Chang
 * @Date: 2021-04-28 14:51:58
 * @LastEditTime: 2021-08-13 12:05:48
 * @Description: 参数校验 - user
 */

import { Validator, Rule } from '@/core/validator';

const commonEamil = [
  new Rule('isNotEmpty', '账号不可为空'),
  new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱'),
];

const commonPass = [
  new Rule('isNotEmpty', '密码不可为空'),
  new Rule(
    'matches',
    '密码长度在6~18之间，支持字母、数字,特殊字符',
    /^[\w#@!~%^&*]{6,18}$/
  ),
];

const commonConfirmPassword = data => {
  if (!data.body.password || !data.body.confirm_password) {
    return [false, '两次输入的密码不一致，请重新输入'];
  }
  let ok = data.body.password === data.body.confirm_password;
  if (ok) {
    return ok;
  } else {
    return [false, '两次输入的密码不一致，请重新输入'];
  }
};

class PassValidator extends Validator {
  password: Rule[];
  constructor() {
    super();
    this.password = commonPass;
  }
}
class EmailValidator extends Validator {
  email: Rule[];
  constructor() {
    super();
    this.email = commonEamil;
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
      new Rule('isLength', '昵称长度必须在2~10之间', 2, 10),
    ];
    this.email = commonEamil;
    this.confirm_password = new Rule('isNotEmpty', '确认密码不可为空');
  }

  // 自定义规则函数, 必须 validate 开头
  validateConfirmPassword(data) {
    commonConfirmPassword(data);
  }
}
class EmailCodeValidator extends EmailValidator {
  reason: Rule[];
  constructor() {
    super();
    this.reason = [new Rule('isNotEmpty', '验证码用途不可为空')];
  }
}

class UpdatePasswordValidator extends PassValidator {
  code: Rule[];
  email: Rule[];
  // confirm_password: Rule;
  constructor() {
    super();
    this.code = [
      new Rule('isNotEmpty', '验证码不可为空'),
      new Rule('matches', '验证码为4位数字', /^[0-9]{4}$/),
    ];
    this.email = commonEamil;
    // this.confirm_password = new Rule('isNotEmpty', '确认密码不可为空');
  }
  // 自定义规则函数, 必须 validate 开头
  // validateConfirmPassword(data) {
  //   commonConfirmPassword(data);
  // }
}
export {
  LoginValidator,
  RegisterValidator,
  EmailValidator,
  EmailCodeValidator,
  UpdatePasswordValidator,
};
