/*
 * @Author: Peng zhang
 * @Date: 2021-02-03 21:21:54
 * @LastEditTime: 2021-08-11 19:01:29
 * @Description: 配置文件
 */

// 环境变量 dev-开发环境 prod-生产环境
export const ENV = 'dev';
// 服务器配置
export const SERVICE = {
  HOST: '',
  PORT: '3000',
};
// 数据库连接配置
export const DATABASE = {
  HOST: '106.52.242.121',
  PORT: 4002,
  DBNAME: 'base',
  USER: 'root',
  PASSWORD: 'zp123456',
  CONNECTION_LIMIT: 1000,
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
// JWT secret
export const JWT = {
  secret: '38fce32e7d20473380cdfc1a642b6802',
  accessExp: 60 * 60, // 1天
  refreshExp: 60 * 60 * 24 * 30, // 一个月
};
// 路径配置
export const PATH = {
  UPLOAD_PATH: 'public/upload',
};
// 限制条件配置
export const LIMIT = {
  UPLOAD_IMG_SIZE: 200 * 1024 * 1024,
};
