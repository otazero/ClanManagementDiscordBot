/**
 * @fileoverview index.ts
 * @description Bot entry point
 */

import { GatewayIntentBits, Client, Partials, Message, ActivityType } from 'discord.js'
import fs from 'fs'
import ini from 'ini'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Message, Partials.Channel],
});
const CONFIG:{ [key : string] : any} = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));
dotenv.config();

const TOKEN:string = CONFIG.Credentials.token;


// DB接続設定
interface DBSetting {
    host: string;
    user: string;
    password: string;
    database: string;
    supportBigNumbers: boolean;
    bigNumberStrings: boolean;
}

const db_setting: DBSetting = {
    host: 'db',
    user: process.env.USER!,
    password: process.env.USER_PASSWORD!,
    database: 'clandb',
    supportBigNumbers: true,
    bigNumberStrings: true,
};

console.log(db_setting);

// ログイン時のログ表示
client.once('ready', async() => {
    console.log('Ready!');
    if (client.user){
        console.log(`Logged in as ${client.user.tag}!`, new Date());
        client.user.setPresence({ activities: [{name: '神げー界隈', type: ActivityType.Competing}], status: 'online' });
    }
});

//メッセージを受け取った時の処理
client.on('messageCreate', async (message: Message) => {
    // Botからのメッセージを無視する
    if (message.author.bot) return
    if (message.content === 'now') {
        const date = new Date();
        message.channel.send(date.toLocaleString());
    }
    if (message.content === 'hihi') {
        console.log("hihi");
        message.reply('hihi');
    }
    if (message.content === 'ping') {
        message.reply('pong');
    }
    if (message.content === 'pong') {
        let mycon: mysql.Connection | null = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }
        if(mycon){
            //データベースから存在フラグがTrueのだけ受け取ります
            const [oldusers, gomi]: [mysql.RowDataPacket[], mysql.FieldPacket[]]  = await mycon.query(`SELECT * FROM d_discord_members`);
            console.log(oldusers);
        }
        if(mycon){
            mycon.end();
        }
    }
});

//ボット作成時のトークンでDiscordと接続
client.login(TOKEN)
    .catch(console.error);