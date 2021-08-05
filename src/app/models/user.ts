/*
 * @Author: Rock Chang
 * @Date: 2021-04-30 17:28:33
 * @LastEditTime: 2021-05-19 17:38:44
 * @Description:
 */

import { query } from '@/utils/util';
import { ErrorResponse } from '@/core/http-exception';

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   admin: number;
//   password?: string;
// }

class User {
  async getUserById(id) {
    const res: any = await query(
      `SELECT id,name,email,phone,admin FROM user WHERE id = ?`,
      [id]
    );
    if (!res.length) {
      throw new ErrorResponse('获取用户信息失败!');
    } else {
      return res[0];
    }
  }
  async getUser(val, key) {
    const res: any = await query(
      `SELECT * FROM user WHERE ${key || 'id'} = ?`,
      [val]
    );
    return res;
  }
}

export { User };
