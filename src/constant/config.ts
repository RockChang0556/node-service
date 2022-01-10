/*
 * @Author: Peng zhang
 * @Date: 2021-02-03 21:21:54
 * @LastEditTime: 2022-01-10 11:20:19
 * @Description: 配置文件
 */
import path from 'path';

// 数据库连接配置
export const DATABASE = {
  HOST: process.env.NODE_ENV === 'production' ? '106.52.242.121' : '127.0.0.1',
  PORT: 3306,
  DBNAME: 'base',
  USER: 'rock',
  PASSWORD: 'zp123456',
  CONNECTION_LIMIT: 1000,
};
// JWT secret
export const JWT = {
  secret: '38fce32e7d20473380cdfc1a642b6802',
  accessExp: 60 * 60 * 24, // 1天
  refreshExp: 60 * 60 * 24 * 30, // 一个月
};
// 邮箱服务发件人信息
export const EAMIL = {
  HOST: 'smtp.163.com',
  USER: 'zhangpeng003@163.com',
  PASSWORD: 'OPPRKGYOEASUECAT',
  validExp: 60 * 5, // 过期时间5min
};

// 环境变量 dev-开发环境 prod-生产环境
// export const ENV = 'dev';
// 服务器配置
export const SERVICE = {
  HOST: '',
  PORT: '3000',
};
// 接口地址配置
export const API = {
  // 项目接口前缀
  PROJECT_INTERFACE_PREFIX: '/api',
  // 后台接口前缀
  ADMIN_INTERFACE_PREFIX: '/adminApi',
  // 移动端接口前缀
  MOBILE_INTERFACE_PREFIX: '/mobileApi',
};
// 路径配置
export const PATH = {
  UPLOAD_PATH: 'public/upload',
};
// 限制条件配置
export const FILE = {
  UPLOAD_SIZE: 1024 * 1024 * 1, // 文件大小限制, 单位M
  // 文件存储位置
  OUT_DIR:
    process.env.NODE_ENV === 'production'
      ? '/app/public/uploads'
      : path.resolve(__dirname, '../../public/uploads'),
};
