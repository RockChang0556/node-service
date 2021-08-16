/*
 * @Author: Rock Chang
 * @Date: 2021-04-28 14:51:58
 * @LastEditTime: 2021-08-16 10:41:05
 * @Description: 参数校验 - user
 */

import { Validator, Rule } from '@/core/validator';

const emailRule = [
  new Rule('isNotEmpty', '账号不可为空'),
  new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱'),
];

const passwordRule = [
  new Rule('isNotEmpty', '密码不可为空'),
  new Rule(
    'matches',
    '密码长度在6~18之间，支持字母、数字,特殊字符',
    /^[\w#@!~%^&*]{6,18}$/
  ),
];
const codeRule = [
  new Rule('isNotEmpty', '验证码不可为空'),
  new Rule('matches', '验证码为4位数字', /^[0-9]{4}$/),
];

// 确认密码验证
// const confirmPasswordRule = data => {
//   if (!data.body.password || !data.body.confirm_password) {
//     return [false, '两次输入的密码不一致，请重新输入'];
//   }
//   let ok = data.body.password === data.body.confirm_password;
//   if (ok) {
//     return ok;
//   } else {
//     return [false, '两次输入的密码不一致，请重新输入'];
//   }
// };

class PassValidator extends Validator {
  password: Rule[];
  constructor() {
    super();
    this.password = passwordRule;
  }
}
class EmailValidator extends Validator {
  email: Rule[];
  constructor() {
    super();
    this.email = emailRule;
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
  code: Rule[];
  constructor() {
    super();
    this.name = [
      new Rule('isNotEmpty', '昵称不可为空'),
      new Rule('isLength', '昵称长度必须在2~10之间', 2, 10),
    ];
    this.email = emailRule;
    this.code = codeRule;
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
    this.code = codeRule;
    this.email = emailRule;
    // this.confirm_password = new Rule('isNotEmpty', '确认密码不可为空');
  }
  // 自定义规则函数, 必须 validate 开头
  // validateConfirmPassword(data) {
  //   confirmPasswordRule(data);
  // }
}

class GetUserValidator extends Validator {
  id: Rule[];
  email: Rule[];
  phone: Rule[];
  constructor() {
    super();
    this.id = [
      new Rule('isOptional'), // 可选参数
      new Rule('isInt', 'id必须为正整数', { min: 1 }),
    ];
    this.email = [
      new Rule('isOptional'),
      new Rule('isEmail', '电子邮箱不符合规范，请输入正确的邮箱'),
    ];
    this.phone = [
      new Rule('isOptional'),
      new Rule('matches', '手机格式不正确', /(^1[3|4|5|7|8]\d{9}$)/),
    ];
  }
}
export {
  LoginValidator,
  RegisterValidator,
  EmailValidator,
  EmailCodeValidator,
  UpdatePasswordValidator,
  GetUserValidator,
};
