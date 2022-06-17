// async/await のmysqlモジュール
const mysql = require("mysql2/promise");

// 秘密ファイル
const fs = require('fs');
const ini = require('ini');
const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

