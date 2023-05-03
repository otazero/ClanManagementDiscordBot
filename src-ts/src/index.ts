/**
 * @fileoverview index.ts
 * @description Bot entry point
 */

import { GatewayIntentBits, Client, Partials, Message, ActivityType } from 'discord.js'

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

import fs from 'fs'
import ini from 'ini'

const CONFIG:{ [key : string] : any} = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));


const TOKEN:string = CONFIG.Credentials.token;

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
});

//ボット作成時のトークンでDiscordと接続
client.login(TOKEN)
    .catch(console.error);