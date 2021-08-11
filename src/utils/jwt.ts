/*
 * @Author: Rock Chang
 * @Date: 2021-08-11 16:02:03
 * @LastEditTime: 2021-08-11 19:16:53
 * @Description: 令牌类，提供令牌的生成和解析功能
 * https://github.com/TaleLin/lin-cms-koa-core/blob/master/lib/jwt/jwt.ts
 */
import Application from 'koa';
import jwtGenerator, { TokenExpiredError } from 'jsonwebtoken';
import {
  ExpiredTokenException,
  InvalidTokenException,
  AuthFailed,
} from '@/core/http-exception';
import { RouterContext } from 'koa-router';
import { get } from 'lodash';
// import { TokenType, TokenCode } from '@/constant/token';
import { JWT } from '@/constant/config';

interface tokenInfo {
  id: number; // 用户id
  admin: number; //用户权限级别, 0为普通用户, 1~5管理员级别递增
}
interface tokenProps {
  exp: number;
  data: tokenInfo;
  scope: string;
  type: string;
  [key: string]: any;
}

interface twoToken {
  accessToken: string;
  refreshToken: string;
}
/**
 * 令牌的类型
 * ACCESS 代表 access token
 * REFRESH 代表 refresh token
 */
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenCode {
  '令牌过期' = 4001,
  '令牌失效或损坏' = 4002,
  '令牌获取失败' = 4004,
  '请使用正确类型的令牌' = 4005,
  '请使用正确作用域的令牌' = 4006,
  'access token 过期' = 4010,
  'access token 损坏' = 4011,
  'refresh token 过期' = 4020,
  'refresh token 损坏' = 4021,
}

class Token {
  /**
   * 令牌的secret值，用于令牌的加密
   */
  secret: string | undefined;

  /**
   * access token 默认的过期时间
   */
  accessExp: number = 60 * 60; // 1h;

  /**
   * refresh token 默认的过期时间
   */
  refreshExp: number = 60 * 60 * 24 * 30 * 3; // 3 months

  /**
   * 构造函数
   * @param secret 牌的secret值
   * @param accessExp access token 过期时间
   * @param refreshExp refresh token 过期时间
   */
  constructor(secret?: string, accessExp?: number, refreshExp?: number) {
    secret && (this.secret = secret);
    refreshExp && (this.refreshExp = refreshExp);
    accessExp && (this.accessExp = accessExp);
  }

  /**
   * 挂载到 ctx 上
   */
  initApp(
    app: Application,
    secret?: string,
    accessExp?: number,
    refreshExp?: number
  ) {
    // 将 jwt 实例挂到 app 的 context 上
    app.context.jwt = this;
    secret && (this.secret = secret);
    refreshExp && (this.refreshExp = refreshExp);
    accessExp && (this.accessExp = accessExp);
  }
  /**
   * 生成两个token
   * @param {any} data 存储的信息
   * @return {*} 两个token
   */
  getTokens(data: any): twoToken {
    const accessToken = jwt.createAccessToken(data);
    const refreshToken = jwt.createRefreshToken(data);
    return { accessToken, refreshToken };
  }
  /**
   * 生成access_token
   * @param data 存储的信息
   */
  createAccessToken(data: any) {
    if (!this.secret) {
      throw new Error('secret can not be empty');
    }
    let exp: number = Math.floor(Date.now() / 1000) + this.accessExp;
    return jwtGenerator.sign(
      {
        exp,
        data,
        scope: 'Rock',
        type: TokenType.ACCESS,
      },
      this.secret
    );
  }

  /**
   * 生成refresh_token
   * @param data 存储的信息
   */
  createRefreshToken(data: any) {
    if (!this.secret) {
      throw new Error('secret can not be empty');
    }
    let exp: number = Math.floor(Date.now() / 1000) + this.refreshExp;
    return jwtGenerator.sign(
      {
        exp,
        data,
        scope: 'Rock',
        type: TokenType.REFRESH,
      },
      this.secret
    );
  }

  /**
   * 解析请求头
   * @param ctx koa 的context
   * @param type 令牌的类型
   */
  parseHeader(ctx: RouterContext, type = TokenType.ACCESS): tokenProps {
    // 此处借鉴了koa-jwt
    if (!ctx.header || !ctx.header.authorization) {
      throw new AuthFailed(TokenCode[4004], 4004);
    }
    const parts = ctx.header.authorization.split(' ');

    if (parts.length === 2) {
      // Bearer 字段
      const scheme = parts[0];
      // token 字段
      const token = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        // @ts-ignore
        const obj = this.verifyToken(token, type);
        if (!get(obj, 'type') || get(obj, 'type') !== type) {
          throw new AuthFailed(TokenCode[4005], 4005);
        }
        if (!get(obj, 'scope') || get(obj, 'scope') !== 'Rock') {
          throw new AuthFailed(TokenCode[4006], 4006);
        }
        return obj;
      } else {
        throw new InvalidTokenException();
      }
    } else {
      throw new InvalidTokenException();
    }
  }

  /**
   * verifyToken 验证token
   * 若过期，抛出ExpiredTokenException
   * 若失效，抛出InvalidTokenException
   *
   * @param token 令牌
   * @param type 令牌类型
   */
  verifyToken(token: string, type = TokenType.ACCESS) {
    if (!this.secret) {
      throw new Error('secret can not be empty');
    }
    // NotBeforeError
    // TokenExpiredError
    let decode;
    try {
      decode = jwtGenerator.verify(token, this.secret);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        if (type === TokenType.ACCESS) {
          throw new ExpiredTokenException(TokenCode[4010], 4010);
        } else if (type === TokenType.REFRESH) {
          throw new ExpiredTokenException(TokenCode[4020], 4020);
        } else {
          throw new ExpiredTokenException();
        }
      } else {
        if (type === TokenType.ACCESS) {
          throw new InvalidTokenException(TokenCode[4011], 4011);
        } else if (type === TokenType.REFRESH) {
          throw new InvalidTokenException(TokenCode[4021], 4021);
        } else {
          throw new InvalidTokenException();
        }
      }
    }
    return decode;
  }
}

/**
 * jwt 的实例
 */
const jwt = new Token(JWT.secret, JWT.accessExp, JWT.refreshExp);

export { Token, jwt };
