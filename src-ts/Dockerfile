FROM node:18

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

# MySQLの設定ファイルをコピーする
COPY ./my.cnf /etc/mysql/my.cnf

# ポート番号を設定する
EXPOSE 3000

CMD ["npm", "run", "start"]