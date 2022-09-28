const fs = require('fs');
const ini = require('ini');
const { PassThrough } = require("stream");
const {ThunderUser} = require('../structures/profile');
const { throws } = require('assert');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const URL = encodeURI(`https://warthunder.com/en/community/claninfo/${config.ThunderConfig.clanname}`);

// puppeteer-extra は puppeteer のドロップイン置き換えです。
// インストール済みの puppeteer にプラグイン機能を追加します。
const puppeteer = require('puppeteer-extra')

// puppeteer usage as normal
const main = async ()=>{
    const browser = await puppeteer.launch({ 
        headless: false , 
        product: "firefox",
        executablePath: 'C:/Program Files/Firefox Nightly/firefox.exe',    // 2. Firefox(Nightly)の実行パス 
        userDataDir: 'D:/Programming/CREATE/ClanManagementDiscordBot/src-js-2/template', // 3. ユーザープロファイルの保存ディレクトリパス
        args: ['-wait-for-browser']    // 4. Firefox(Nightly)の起動を待つ
    });
        console.log('Running tests..')
        // const context = await browser.newContext();
        const page = await browser.newPage()
        await page.goto(URL)
        await page.waitForNavigation('load');
        await page.waitForSelector('div.content__title');

        const results = await page.$$("div.squadrons-members__grid-item");
        
        let users = [];
        for(let j = 0; j < results.length; j++){
            if(j > 5){
                const text = await results[j].evaluate(e => e.innerText);
                const i = Math.floor(j / 6) - 1;
                switch (j % 6) {
                    case 0:
                        const temp = new ThunderUser();
                        temp.isflag = true;
                        users.push(temp);
                        break;
                    case 1:
                        const ign = text;
                        users[i].ign = ign;
                        break;
                    case 2:
                        break;
                    case 3:
                        users[i].nowactive = Number(text);
                        break;
                    case 4:
                        users[i].setrole = [text];
                        break;
                    case 5:
                        users[i].setEnter = text;
                        break;
                    default:
                        break;
                }
            }
        }
        await browser.close();
        console.log(`All done, check the screenshot. ✨`);
        return users;
};


const startTime = performance.now();
main().then((users)=>{
    const endTime = performance.now();
    console.log(users[0]);
    console.log(`実行時間は ${(endTime - startTime)/1000} 秒です\n`);
}); 