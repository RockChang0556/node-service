/*
 * @Author: Rock Chang
 * @Date: 2021-11-26 15:44:49
 * @LastEditTime: 2021-12-16 18:10:27
 * @Description: redis数据库操作函数
 */

import { createClient } from 'redis';

class Redis {
  client: any;
  constructor() {
    this.client = createClient({
      url: 'redis://:zp123456@106.52.242.121:6379',
    });
    this.client.on('error', err => console.log('Redis Client Error', err));
    this.client.connect();
  }

  async set(key, value, time) {
    if (typeof value === 'undefined' || value === null || value === '') {
      return;
    }
    if (typeof value === 'string') {
      if (typeof time !== 'undefined') {
        this.client.set(key, value, {
          EX: time,
        });
      } else {
        this.client.set(key, value);
      }
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(k => {
        this.client.hSet(key, k, String(value[k]));
      });
    } else {
      this.client.set(key, value);
    }
  }
  async get(key) {
    return this.client.get(key);
  }
  async hget(key) {
    return this.client.hGetAll(key);
  }
}
const redis = new Redis();
export { redis };
