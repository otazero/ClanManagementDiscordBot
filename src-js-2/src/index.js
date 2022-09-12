const { Client , Intents, MessageEmbed, Permissions} = require('discord.js');
const {Daily, Monthly} = require(`./runbot/main.js`);

const client = new Client({
    intents: Object.values(Intents.FLAGS)
});

const cron = require('node-cron');

const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const token = config.Credentials.token;

/* ロールID */
const clanMemberRole = "558947013744525313";
const genroMemberRole = "483571690429743115";
const botRole = "558945569624817684";
const thunderRole = "746933519518924910";

/* チャンネルID */
const clanNewsCh = "819208111017295973";
const changeRoleCallCh = "1016533368604725390";
const testDropCh = "967753820052533248";
const callCenterCh = "747434239456313425";

'use strict';
client.once('ready', async() => {
    console.log('接続しました！', new Date());
});

client.on('ready', async() => {
    cron.schedule('0 0 3 * * *', async() => {
        // TODO: スクレイピング→入退室の確認など
        console.log("3時だよ!全員集合！");
        const daily = new Daily();
        await daily.main();
        console.log(daily.test);
        
        const embed = new MessageEmbed()
                    .setTitle('定時報告')
                    .setDescription('本日も一日お疲れさまでした！定時報告です！')
                    .addFields(
                        {   
                            name:`🌸ご入隊ありがとうございます🌸`, 
                            value:`本日${daily.wotbEnters.length+daily.thunderEnters.length+daily.discordEnters.length}名の方が当クランに参加してくださいました！\nよろしくね～♪`
                        }, 
                        {
                            name:'<:WT:747482544714547231>WarThunder部門', 
                            value:`${daily.thunderEntersText}`,
                            inline:true
                        }, 
                        {
                            name:'<:Blitz:755234073957367938>World of Tanks Blitz部門', 
                            value:`${daily.wotbEntersText}`, 
                            inline:true
                        },
                        {
                            name:'<:discord:1016346034760327218>クランサーバー部門', 
                            value:`${daily.discordEntersText}`, 
                            inline:true
                        },
                        {   
                            name:`🎉お疲れさまでした🎉`, 
                            value:`本日${daily.wotbLefters.length+daily.thunderLefters.length+daily.discordLefters.length}名の方が脱退しました。\n今までありがとうございました。`
                        }, 
                        {
                            name:'<:WT:747482544714547231>WarThunder部門', 
                            value:`${daily.thunderLeftersText}`,
                            inline:true
                        }, 
                        {
                            name:'<:Blitz:755234073957367938>World of Tanks Blitz部門', 
                            value:`${daily.wotbLeftersText}`, 
                            inline:true
                        },
                        {
                            name:'<:discord:1016346034760327218>クランサーバー部門', 
                            value:`${daily.discordLeftersText}`, 
                            inline:true
                        },)
                    .setColor('#800080')
                    .setTimestamp();

        client.channels.cache.get(clanNewsCh).send({ embeds: [embed] });
        
        // クランメンバー→元老
        const discordMemberInfo = client.guilds.cache.get(`${config.DiscordConfig.guildid}`);
        daily.roleChangers.forEach(obj => {
            if(obj.change == "toClanmem"){
                discordMemberInfo.members.fetch(obj.user.id).then((member) => {
                    // クラメンロール付与
                    member.roles.add(clanMemberRole);
                    // 元老ロール剥奪
                    member.roles.remove(genroMemberRole);
                });
            }
            else if(obj.change == "toGenro"){
                discordMemberInfo.members.fetch(obj.user.id).then((member) => {
                    // 元老ロール付与
                    member.roles.add(genroMemberRole);
                    // クランメンバーロール剥奪
                    member.roles.remove(clanMemberRole);
                });
            }
            else{
                console.log("どこも通過しなかった");
            }
        });
        // テスト用ID
        client.channels.cache.get(changeRoleCallCh).send(daily.roleChangeText);
    },{
        scheduled: true,
        timezone: "Asia/Tokyo"
    });
    // アクテビティ更新
    cron.schedule('30 58 8 * * *', async() => {
    // cron.schedule('30 09 19 * * *', async() => {
        const mom = new Monthly();
        await mom.main();
        sendKickCall(mom.kickMemText);
    },{
        scheduled: true,
        timezone: "Asia/Tokyo"
    });
});

client.on("messageCreate", (message) => {
    if (message.author.bot) { //botからのmessageを無視
        return;
    }
    if (message.content === 'hihi') {
        console.log("hihi");
    }
});

client.login(token)
    .catch(console.error);

function sendKickCall(text){
    const embed = new MessageEmbed()
                    .setTitle('__**:cherry_blossom:非アクティブメンバー粛清大会:cherry_blossom:**__')
                    .setDescription('**非アクティブ且つDiscordクラン鯖未参加プレイヤー**を部隊よりキックします。\n候補者は下記の通りです。不具合により誤検出される場合があります。\n該当者は至急連絡されたし。')
                    .addFields(
                        {   
                            name:`粛正対象者一覧`, 
                            value:`${text}\n※非アクティブプレイヤー\n\tWarThunder部門入隊後${config.KickMember.progress}日が経過し直近30日のアクティビティが${config.KickMember.minactivity}以下の者`
                        })
                    .setColor('#00ff00')
                    .setTimestamp();

    client.channels.cache.get(callCenterCh).send({content: `<@&${thunderRole}>`, embeds: [embed] });
}