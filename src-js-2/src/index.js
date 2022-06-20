const { Client , Intents, MessageEmbed, Permissions} = require('discord.js');
const client = new Client({
    intents: Object.values(Intents.FLAGS)
});

const cron = require('node-cron');
const mainApp = require('./runbot');

const fs = require('fs');
const ini = require('ini');

let config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const token = config.Credentials.token;

'use strict';
client.once('ready', () => {
    console.log('接続しました！', new Date());
});

client.on('ready', () => {
    cron.schedule('0 */1 * * * *', () => {
        // TODO: スクレイピング→入退室の確認など
        console.log("経過！");

        //const now = new Date();
        //const pass = (now.getTime() - start.getTime()) / 1000 / 60;
        //client.channels.cache.get('967753820052533248').send(`起動後${Math.round(pass)}分経過`);
    },{
        scheduled: true,
        timezone: "Asia/Tokyo"
    });
});

client.login(token)
  .catch(console.error);
