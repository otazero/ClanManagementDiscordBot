require('dotenv').config();

var app = require('./process/scraping');

const { Client } = require('discord.js');
const token = process.env.BOT_TOKEN;
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

client.once('ready', () => {
  console.log('接続しました！');
});

// client.on('message', (message) => {
//   console.log('通過！');
//   if (message.content === 'やぁ' && !message.author.bot){
//     message.reply('こんにちは！').catch(console.error);
//   }
// });

client.on("messageCreate", (message) => {
  if (message.author.bot) { //botからのmessageを無視
    return;
  }
  let msg = message.content; //ユーザが送信したメッセージはmessage.contentで取得可能
  message.channel.send(msg); //メッセージが送られたチャンネルに返信
  app.scraping();
});
// client.on('message', async message => {
//   if (message.content === '!prompt') {
//     message.channel.send('yes か no を送信してください')
//     const filter = msg => msg.author.id === message.author.id
//     const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 })
//     const response = collected.first()
//     if (!response) return message.channel.send('タイムアウト')
//     if (!['yes', 'no'].includes(response.content)) return message.channel.send('正しくありません')
//     message.channel.send(`${response.content} が送信されました`)
//   }
// })

client.login(token)
  .catch(console.error)
