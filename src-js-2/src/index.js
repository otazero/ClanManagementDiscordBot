const fs = require('fs');
const ini = require('ini');

let config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

