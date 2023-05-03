# クランDiscord鯖管理Bot

## 目標

- ~~Herokuによるデプロイ~~herokuのDB心もとないからラズパイでデプロイするかも(24時間稼働の実現)
- 三度目の正直！分けわからんファイル経由のデータの受け渡しを極力削減
- 1年後に観ても理解できるコード・書き方にする！

## メモ

自称一番見やすく書いてるバージョン？
src-js-2

mysql -u root -p
create database clandb;
drop database clandb;

### Dockerイメージのビルド
```
docker build -t my-discordbot .
```

### コンテナの実行
```
docker run -it --rm -p 8080:8080 my-discordbot
```
### 終了
```
docker stop my-discordbot
```

### 動いてるコンテナを表示

```
docker ps
```

### コンテナ内のシェル
```
docker exec -it <コンテナID> sh
docker exec -it <コンテナID> /bin/bash
```

### コンテナ内シェルから抜ける
```
exit
```

### コンテナ内MySQLにアクセス
```
docker exec -it my-mysql mysql -u <ユーザー名> -p <パスワード> <データベース名>
```

### ダミーデータの移動
```
docker exec -i my-mysql mysql -u otazero -p<パスワード> clandb < dump.txt
```