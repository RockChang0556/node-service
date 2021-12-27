FROM mhart/alpine-node:14.17.3
# 安装 nodejs 和 yarn
# RUN apk add --no-cache --update nodejs=16.13.1-r0

LABEL maintainer=peng0556@qq.com

EXPOSE 4300 

# 创建一个工作目录
WORKDIR /app

COPY package.json .

RUN npm install --registry=https://registry.npm.taobao.org

COPY . .


# 这里产生了dist目录，及server.bundle.js
RUN npm run build

VOLUME [ "/app/public" ]

CMD ["node", "dist/bundle.js"]