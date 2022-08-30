const request = require('request');
const fs = require('fs');
const ini = require('ini');

const {WotbUser, DiscordUser} = require('../structures/profile');

const {WhatYourIgn} = require('../what-your-Info/whatYourInfo');

const {Scrape} = require('./scraping');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

// 戻り値は全てUserクラスにする

/**
 * 3つのAPIを統合したクラス(WarThunder, Wotb, Discord)
 * 戻り値はUserクラス
 */
class IntegrationApiRequest{
    /** @returns {promise[]}  */
    static requestThunder(){
        // スクレイピング
        return Scrape.thunderClanTable();
    }

    /** @returns {promise[]}  */
    static async requestWotb(){
        const option = {
            url: `https://api.wotblitz.asia/wotb/clans/info/?application_id=${config.WargamingConfig.applicationid}&clan_id=${config.WargamingConfig.clanid}&extra=members&fields=members%2C+members_ids%2C+updated_at%2C+members_count%2C+tag`,
            method: 'GET',
            json: true
        }
        const promiseJson = await this.#requestPromise(option);

        return Jsontouserclass.wotb(promiseJson.data[`${config.WargamingConfig.clanid}`].members);
    }

    /** @returns {promise[]}  */
    static async requestDiscord(){
        const headers = {
            "Authorization": `Bot ${config.Credentials.token}`
        }
        
        const option ={
            url: `https://discord.com/api/v8/guilds/${config.DiscordConfig.guildid}/members?limit=${config.DiscordConfig.limit}`,
            method: 'GET',
            headers: headers,
            json: true,
        }
        const promiseJson = await this.#requestPromise(option);
        return Jsontouserclass.discord(promiseJson);
    }
    
    static #requestPromise(param){
        return new Promise((resolve, reject)=>{
            request(param, function (error, response, body) {
                if(error){
                    reject("鯖落ち説(定期)");
                }else{
                    resolve(body);
                }
            });
        });
    }
}

/**
 * Jsonからユーザークラスに変換(Wotb, Discord)
 */
class Jsontouserclass{
    /** @returns {DiscordUser[]}  */
    static discord(data){
        const users = data.filter(member => !(member.user.bot === true)).map(member => {
            let user = new DiscordUser();
            user.id = member.user.id;
            user.ign = WhatYourIgn.getign(member.user.username, member.nick);
            user.setrole = member.roles;
            user.setEnter = member.joined_at;
            user.username = member.user.username;
            user.wotbClass = null;
            user.thunderClass = null;
            user.nick = member.nick;
            return user;
        });
        return users;
    }
    /** @returns {WotbUser[]}  */
    static wotb(data){
        const users = ((data)=>{
            let result = [];
            Object.keys(data).forEach((id) => {
                const member = data[''+id];
                let user = new WotbUser();
                user.id = Number(id);
                user.ign = member.account_name;
                user.setrole = [member.role];
                user.setEnter = member.joined_at;
                result.push(user);
            });
            return result;
        })(data);
        return users;
    }
}

// console.log(otherModule)
//integrationApiRequest.requestDiscord().then(body => console.log(body));
//integrationApiRequest.requestWotb().then(body => console.log(body));
//integrationApiRequest.requestThunder().then(body => console.log(body));


module.exports = {
    IntegrationApiRequest
}