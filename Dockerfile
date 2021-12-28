FROM alpine:3.13 AS base
# 安装 nodejs 和 yarn
RUN apk add --no-cache --update nodejs=14.18.1-r0

LABEL maintainer=peng0556@qq.com

EXPOSE 4300 

# 创建一个工作目录
WORKDIR /app

# 使用基础镜像 装依赖阶段
FROM base AS install

COPY package.json .

RUN npm install --registry=https://registry.npm.taobao.org

# 最终阶段，也就是输出的镜像是这个阶段构建的，前面的阶段都是为这个阶段做铺垫
FROM base

COPY . .

# 这里产生了dist目录，及server.bundle.js
RUN npm run build

VOLUME [ "/app/public" ]

CMD ["node", "dist/bundle.js"]