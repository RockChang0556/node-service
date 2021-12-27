FROM node:10 

LABEL maintainer=peng0556@qq.com

# 创建一个工作目录
WORKDIR /app

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org

# 这里产生了dist目录，及server.bundle.js
RUN npm run build

EXPOSE 4300 

VOLUME [ "/app/public" ]

CMD ["node", "dist/bundle.js"]