// async/await のmysqlモジュール
const mysql = require("mysql2/promise");

// 秘密ファイル
const fs = require('fs');
const ini = require('ini');
let config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

// メンバー一覧表示サイトURL