const { Client , Intents, MessageEmbed, Permissions} = require('discord.js');
const {Daily, Monthly} = require(`./runbot/main.js`);
const {fixedTermReport, kickCall} = require(`./messages/message.js`);

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


/* コマンドを読み込み */
const commands = (()=>{
    const commands = {};
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands[command.data.name] = command;
    }
    return commands;
})();


'use strict';
client.once('ready', async() => {
    /* コマンドを登録 */
    const data = (()=>{
        const data = [];
        for (const commandName in commands) {
            data.push(commands[commandName].data);
        }
        return data;
    })();    
    await client.application.commands.set(data, config.DiscordConfig.guildid);
    console.log('接続しました！', new Date());
});

client.on('ready', async() => {
    cron.schedule('0 0 3 * * *', async() => {
        // TODO: スクレイピング→入退室の確認など
        console.log("3時だよ!全員集合！");
        const daily = new Daily();
        await daily.main();
        console.log(daily.test);
        // 定時報告送信
        await fixedTermReport(MessageEmbed, client, daily, clanNewsCh);

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
    // cron.schedule('30 12 15 * * *', async() => {
        const mom = new Monthly();
        await mom.main();
        await kickCall(MessageEmbed, client, mom.kickMemText, callCenterCh, thunderRole, config);
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

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
});

client.login(token)
    .catch(console.error);

