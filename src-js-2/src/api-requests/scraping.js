const client = require("cheerio-httpcli");
const fs = require('fs');
const ini = require('ini');
const { PassThrough } = require("stream");
const {ThunderUser} = require('../structures/profile');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const URL = encodeURI(`https://warthunder.com/en/community/claninfo/${config.ThunderConfig.clanname}`);

class Scrape{
    static async thunderClanTable(){
        const result = await client.fetch(URL);
        const $ = result.$;
        let users = [];
        $('div.squadrons-members__grid-item').each((index, value)=>{
            if(0 <= index && index < 6){
                return;
            }
            else{
                const i = Math.trunc(index / 6) - 1;
                switch (index % 6) {
                    case 0:
                        const temp = new ThunderUser();
                        temp.isflag = true;
                        users.push(temp);
                        break;
                    case 1:
                        //console.log(value.children[1].attribs.href.replace('en/community/userinfo/?nick=', ''));
                        const ign = value.children[1].attribs.href.replace('en/community/userinfo/?nick=', '').split('@');
                        users[i].ign = ign[0];
                        break;
                    case 2:
                        break;
                    case 3:
                        // console.log(value.children[0].data.replace(/\s+/g, ''));
                        users[i].nowactive = Number(value.children[0].data.replace(/\s+/g, ''));
                        break;
                    case 4:
                        //　console.log(value.children[0].data.replace(/\s+/g, ''));
                        users[i].setrole = [value.children[0].data.replace(/\s+/g, '')];
                        break;
                    case 5:
                        //console.log(value.children[0].data.replace(/\s+/g, ''));
                        users[i].setEnter = value.children[0].data.replace(/\s+/g, '');
                        break;
                    default:
                        break;
                }
            }
        });
        return users;
    }
}

Scrape.thunderClanTable();



module.exports = {
    Scrape
};

