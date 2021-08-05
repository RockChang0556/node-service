/*
 * @Author: Rock Chang
 * @Date: 2021-04-25 21:06:41
 * @LastEditTime: 2021-05-19 17:09:13
 * @Description: 请求格式定义
 */

// 基类
class HttpException extends Error {
  public code: number = -1;
  public message: string = '服务器异常';
  public status: number = 500;
  public data?: {
    [key: string]: any[];
  };
}

class DataResponse extends HttpException {
  constructor(data?: any, message?: string, code?: number) {
    super();
    this.data = data || {};
    this.message = message || 'ok';
    this.code = code || 0;
    this.status = 200;
  }
}

class SuccessResponse extends HttpException {
  constructor(message?: string, code?: number) {
    super();
    this.message = message || '操作成功';
    this.code = code || 1;
    this.status = 200;
  }
}

class ErrorResponse extends HttpException {
  constructor(message?: string, code?: number) {
    super();
    this.message = message || '操作失败';
    this.code = code || 2;
    this.status = 200;
  }
}

class ParamsErr extends HttpException {
  constructor(message?: string, code?: number) {
    super();
    this.message = message || '参数错误';
    this.code = code || 3;
    this.status = 400;
  }
}

class AuthFailed extends HttpException {
  constructor(message?: string, code?: number) {
    super();
    this.message = message || '授权失败';
    this.code = code || 4;
    this.status = 401;
  }
}
class Forbidden extends HttpException {
  constructor(message?: string, code?: number) {
    super();
    this.message = message || '禁止访问';
    this.code = code || 5;
    this.status = 403;
  }
}

export {
  HttpException,
  DataResponse,
  SuccessResponse,
  ErrorResponse,
  ParamsErr,
  AuthFailed,
  Forbidden,
};
