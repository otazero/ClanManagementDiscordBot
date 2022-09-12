const { Client, ClientApplication } = require("discord.js");

const cron = require('node-cron');

const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const token = config.Credentials.token;


async function deleting(client, commandid, guildID) {
    return client.application.commands.delete(commandid, guildID);
}


const client = new Client({
    intents: 0,
});
client.token = token;
async function main() {
    client.application = new ClientApplication(client, {});
    await client.application.fetch();
    await deleting(client, "1018888086417047653", config.DiscordConfig.guildid);
    console.log("deleted succeed!");
}
main().catch(err=>console.error(err));