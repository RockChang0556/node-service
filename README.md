## 介绍

node 实现简易接口功能

## 技术选型/亮点

- Koa2
- TypeScript
- Class 写法
- 封装权限中间件, 利用 jwt 实现接口级权限控制
- 全局错误监听, 错误信息更明了

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
