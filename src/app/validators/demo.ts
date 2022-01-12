/*
 * @Author: Rock Chang
 * @Date: 2021-04-26 16:03:58
 * @LastEditTime: 2022-01-12 17:41:53
 * @Description: 参数校验 - demo/公共校验
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
  // 自定义规则函数, 必须 validate 开头
  // validateConfirmPassword(data) {
  //   if (!data.body.password || !data.body.confirm_password) {
  //     return [false, '两次输入的密码不一致，请重新输入'];
  //   }
  //   let ok = data.body.password === data.body.confirm_password;
  //   if (ok) {
  //     return true;
  //   } else {
  //     return [false, '两次输入的密码不一致，请重新输入'];
  //   }
  // }
}
class NameValidator extends Validator {
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

export { Validator, PositiveIntValidator, NameValidator };
