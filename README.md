## 介绍

node 实现简易接口功能

## 技术选型/亮点

- mysql + sequelize
- Koa2 + ES6
- TypeScript
- 模块化 - Class 写法
- 封装权限中间件, 利用 jwt 实现接口级权限控制
- 双 token, access_token 过期无感刷新
- 全局错误监听中间件, 错误信息更明了

## 接口文档

- 本地 markdown 文件地址 `/docs/api.md`
- 在线文档: https://docs.apipost.cn/preview/d5afe6878646284b/34cd77af726d9044

- 数据字典
  https://www.yuque.com/rockchang/lt68m4/fqdf8u

## 启动项目

```
npm install
npm run serve
```

## vscode 调试配置-launch.json

```js
{
  "type": "node",
  "request": "launch",
  "name": "nodemon",
  "runtimeExecutable": "/usr/local/bin/nodemon",
  "runtimeArgs": [
    "--exec",
    "ts-node",
    "-r",
    "tsconfig-paths/register",
    "--files"
  ],
  "program": "${workspaceFolder}/src/main.ts",
  "restart": true,
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "skipFiles": [
    "<node_internals>/**"
  ],
},
```
