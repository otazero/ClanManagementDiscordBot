require('dotenv').config();
const mainApp = require('./process/main');
const cron = require('node-cron');

const data = require('../data/data.json');
const ngWords = data.date.ngWords;

const { Client , Intents, MessageEmbed, Permissions} = require('discord.js');
const token = process.env.BOT_TOKEN;
const client = new Client({
  // intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
  // intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS", "GUILD_PRESENCES", "GUILD_MESSAGES"]
  intents: Object.values(Intents.FLAGS)
});
'use strict';

const guild_id = process.env.GUILD_ID;
// mesConttents
client.once('ready', () => {
  console.log('接続しました！');
  //.roles.add('558947013744525313')
});

const start = new Date();

// 毎分
// '* * * * *'
// 毎分0秒に1分起きに実行
// '0 */1 * * * *'
client.on('ready', () => {
  cron.schedule('0 */1 * * * *', () => {
    // TODO: スクレイピング→入退室の確認など
    const now = new Date();
    const pass = (now.getTime() - start.getTime()) / 1000 / 60;
    client.channels.cache.get('967753820052533248').send(`起動後${Math.round(pass)}分経過`);
  },{
    scheduled: true,
    timezone: "Asia/Tokyo"
  });
});

/*  ロール等に変更があった場合  */
// TODO:DiscordMembersのロールを変更
/*
  変更前
[ '746933519518924910', '558947013744525313', '428086533086642179' ]
変更後
[
  '746933519518924910',
  '968726766208299068',
  '558947013744525313',
  '428086533086642179'
]
*/
client.on('guildMemberUpdate', (oldMembers, newMembers) => {
  // 変更前
  const oldRoles = oldMembers.roles.cache.map(role => role.id);
  // 変更後
  const newRoles = newMembers.roles.cache.map(role => role.id);
  let oldR = [];
  let newR = [];
  let temps = [];
  for(let role of oldRoles){
    if(newRoles.includes(role)){
      temps.push(role);
    }
    else{
      oldR.push(role);
    }
  }
  for(let role of newRoles){
    if(temps.includes(role)){
      continue;
    }
    else{
      newR.push(role);
    }
  }
  // クラン→元老
  if(oldR.includes('558947013744525313') &&  newR.includes('483571690429743115')){
    //TODO: DB変更
  }
});

// client.on('message', (message) => {
//   console.log('通過！');
//   if (message.content === 'やぁ' && !message.author.bot){
//     message.reply('こんにちは！').catch(console.error);
//   }
// });
/* 入室 */
client.on('guildMemberAdd', (member) => {
  console.log(`${member.guild.name} に ${member.displayName} が参加しました`);
});
/* 退室 */
client.on('guildMemberRemove', (member) => {
  console.log(`${member.guild.name} から ${member.displayName} が退出しました`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) { //botからのmessageを無視
    return;
  }
  /* 一日一回行うコード(入退室者の云々) */
  if (message.content === '!oneDay') {
    mainApp.runEveryDay().then(([mesConttents, WtLefter, WotbLefter]) => {

      // ロール移動
      // クランメンバー→元老
      const discordMemberInfo = client.guilds.cache.get(`${guild_id}`);
      if(WtLefter.discordIds.length){
        for(let discordid of WtLefter.discordIds){
          discordMemberInfo.members.fetch(`${discordid}`).then((member) => {
            // 元老ロール付与
            member.roles.add(`483571690429743115`);
            // クランメンバーロール剥奪
            member.roles.remove(`558947013744525313`);
          });
        }
      }
      if(WotbLefter.discordIds.length){
        for(let discordid of WotbLefter.discordIds){
          discordMemberInfo.members.fetch(`${discordid}`).then((member) => {
            // 元老ロール付与
            member.roles.add(`483571690429743115`);
            // クランメンバーロール剥奪
            member.roles.remove(`558947013744525313`);
          });
        }
      }
      // 文字数制限
      mesConttents.joinWt = mesConttents.joinWt.substring(0, 700);
      // inWT inWotb outWT out Wotb
      if(mesConttents.mesFlag.inWt){
        if(mesConttents.mesFlag.inWotb){
          if(mesConttents.mesFlag.outWt){
            if(mesConttents.mesFlag.outWotb){
              // 1 1 1 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 1 1 1 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }else{
            if(mesConttents.mesFlag.outWotb){
              // 1 1 0 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 1 1 0 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }
        }else{
          if(mesConttents.mesFlag.outWt){
            if(mesConttents.mesFlag.outWotb){
              // 1 0 1 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 1 0 1 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }else{
            if(mesConttents.mesFlag.outWotb){
              // 1 0 0 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 1 0 0 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }
        }
      }else{
        if(mesConttents.mesFlag.inWotb){
          if(mesConttents.mesFlag.outWt){
            if(mesConttents.mesFlag.outWotb){
              // 0 1 1 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 0 1 1 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }else{
            if(mesConttents.mesFlag.outWotb){
              // 0 1 0 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 0 1 0 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🌸ご入隊おめでとうございます🌸`, `本日${mesConttents.mesFlag.inWotb+mesConttents.mesFlag.inWt}名の方が当クランに参加してくださいました！\nよろしくね～♪`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.joinWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.joinWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }
        }else{
          if(mesConttents.mesFlag.outWt){
            if(mesConttents.mesFlag.outWotb){
              // 0 0 1 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 0 0 1 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }else{
            if(mesConttents.mesFlag.outWotb){
              // 0 0 0 1
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！定時報告です！')
                .addField(`🎉お疲れさまでした🎉`, `本日${mesConttents.mesFlag.outWotb+mesConttents.mesFlag.outWt}名の方が当クランを脱退しました。\n今までありがとうございました。`)
                .addField(`<:WT:747482544714547231>WarThunder部門`, `${mesConttents.leftWt}`, true)
                .addField(`<:Blitz:755234073957367938>World of Tanks Blitz部門`, `${mesConttents.leftWotb}`, true)
                .setColor('#800080')
                .setTimestamp();
              client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }else{
              // 0 0 0 0
              const embed = new MessageEmbed()
                .setTitle('定時報告')
                .setDescription('本日も一日お疲れさまでした！また明日もがんばろー💪')
                .setColor('#800080')
                .setTimestamp();
                client.channels.cache.get('967753820052533248').send({ embeds: [embed] });
            }
          }
        }
      }
    });
    return;
  }
  
  if (message.content === 'hihi') {
    mainApp.test().then((val) => {
      console.log(val);
    });
    return;
  }
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
  .catch(console.error);

//クラス名
//.constructor.name