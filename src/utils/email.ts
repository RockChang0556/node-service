/*
 * @Author: Rock Chang
 * @Date: 2021-08-12 10:20:19
 * @LastEditTime: 2021-12-22 16:40:23
 * @Description: 邮件类, 提供发送验证码等功能
 */

import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import svgCaptcha from 'svg-captcha';
import { EAMIL } from '@/constant/config';
import { ErrorResponse, SuccessResponse } from '@/core/http-exception';
import { redis } from './redis';
import { ERR_CODE } from '@/constant/emun';

class Email {
  private transport: any;
  constructor(config: any) {
    this.init(config);
  }
  private init(config: any) {
    this.transport = nodemailer.createTransport(
      smtpTransport({
        host: config.host || 'smtp.163.com', // 服务
        port: config.port || 465, // smtp端口
        secure: true,
        auth: {
          user: config.user || 'zhangpeng003@163.com', //用户名
          pass: config.pass || 'xxxxxxx', // SMTP授权码
        },
      })
    );
  }

  // 发送邮件
  private send(email: string, content: string, code: string) {
    return new Promise(resolve => {
      this.transport.sendMail(
        {
          from: 'zhangpeng003@163.com', // 发件邮箱
          to: email, // 收件人
          subject: '【Rock社区】邮件验证服务', // 标题
          html: `
              <p>您好！欢迎来到【Rock社区】</p>
              <p>您正在进行的操作是: ${content}</p>
              <p>您的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
              <p>***该验证码5分钟内有效***</p>`,
        },
        error => {
          resolve(!error);
          this.transport.close(); // 如果没用，关闭连接池
        }
      );
    });
  }
  /** 发送验证码
   * @param {string} addressEmail 收件人邮箱
   * @param {string} content 邮件内容
   * @return {*}
   */
  async sendCode(addressEmail: string, content: string) {
    const code: string = Math.random().toString().slice(2, 6);
    const success = await this.send(addressEmail, content, code);
    if (success) {
      // 执行验证码入库操作
      await redis.set(addressEmail, code, EAMIL.validExp);
      throw new SuccessResponse(ERR_CODE[4100]);
    } else {
      throw new ErrorResponse(ERR_CODE[4101], 4101);
    }
  }

  /** 验证验证码 删除校验成功,过期及失效数据
   * @param {string} email 邮箱
   * @param {string} code 验证码
   * @return {*}
   */
  async verifyCode(email: string, code: string) {
    const res = await redis.get(email);
    if (res) {
      // 图形验证码是否正确
      if (res.toLowerCase() !== code.toLowerCase())
        throw new ErrorResponse(ERR_CODE[4103], 4103);
      return true;
    } else {
      throw new ErrorResponse(ERR_CODE[4105], 4105);
    }
  }
}

class CaptchaCode {
  async sendCode(sid: string) {
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 120,
      height: 40,
    });
    // 设置图片验证码超时10分钟
    await redis.set(sid, newCaptca.text, 10 * 60);
    return newCaptca;
  }
  async verifyCode(sid: string, code: string) {
    const res = await redis.get(sid);
    if (res) {
      // 图形验证码是否正确
      if (res.toLowerCase() !== code.toLowerCase())
        throw new ErrorResponse(ERR_CODE[4103], 4103);
      return true;
    } else {
      throw new ErrorResponse(ERR_CODE[4105], 4105);
    }
  }
}
const emailUtils = new Email({
  host: EAMIL.HOST,
  user: EAMIL.USER,
  pass: EAMIL.PASSWORD,
});
const captchaCode = new CaptchaCode();

export { Email, emailUtils, captchaCode };
