const { Client, ClientApplication } = require("discord.js");

const cron = require('node-cron');

const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const token = config.Credentials.token;

/**
 * 
 * @param {Client} client 
 * @param {import("discord.js").ApplicationCommandData[]} commands 
 * @param {import("discord.js").Snowflake} guildID 
 * @returns {Promise<import("@discordjs/collection").Collection<string,import("discord.js").ApplicationCommand>>}
 */
async function register(client, commands, guildID) {
    return client.application.commands.set(commands, guildID);
}
async function deleting(client, commandid, guildID) {
    return client.application.commands.delete(commandid, guildID);
}

const detectKickMember = {
    name: "kickmem",
    description: "非アクティブプレイヤーを検出します。",
};
const setSub ={
    name: "setsub",
    description: "サブ垢を設定します。",
    options: [
        {
            type: "USER",
            name: "subaccount",
            description: "サーバーに所属する本垢を選択してください。",
            required: true,
        }
    ]
};
const profile = {
    name: "profile",
    description: "Botに登録されているプロフィールを表示します。",
}

const activity = {
    name: "activity",
    description: "WarThunderのアクティビティ履歴を表示します。",
    options: [
        {
            type: "STRING",
            name: "period",
            description: "グラフに表示する期間を選択してください。(デフォルト:直近1年)",
            choices: [
            {
                name: "直近1年",
                value: "oneYear"
            },
            {
                name: "直近半年",
                value: "halfYear"
            },
            {
                name: "全て",
                value: "all"
            }
            ],
        }
    ]
}
const commands = [detectKickMember, setSub, profile, activity];
const client = new Client({
    intents: 0,
});
client.token = token;
async function main() {
    client.application = new ClientApplication(client, {});
    await client.application.fetch();
    await register(client, commands, config.DiscordConfig.guildid);
    console.log("registration succeed!");
}
main().catch(err=>console.error(err));