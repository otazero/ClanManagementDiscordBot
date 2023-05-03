FROM node:18.16.0-alpine

# タイムゾーンを設定する
ENV TZ Asia/Tokyo

WORKDIR /usr/src/app

# buildディレクトリを作成する
RUN mkdir build

COPY package*.json ./

RUN npm install

COPY . .

# TypeScriptをコンパイル
RUN npm run compile

# ポートマッピング
EXPOSE 8080

CMD ["npm", "run", "start"]