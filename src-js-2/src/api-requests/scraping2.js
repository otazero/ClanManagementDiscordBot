const playwright = require('playwright');
const fs = require('fs');
const ini = require('ini');
const { PassThrough } = require("stream");
const {ThunderUser} = require('../structures/profile');
const { throws } = require('assert');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const URL = encodeURI(`https://warthunder.com/en/community/claninfo/${config.ThunderConfig.clanname}`);

// const memo = {
//     headless: false, 
//     executablePath: 'chromium-browser', /* firefox-browser */
//     args: ["--no-sandbox", "--disable-setuid-sandbox"]
// }

class Scrape{
    static async thunderClanTable(){
        const browserType = 'firefox';
        const options = {
            headless: true, // ヘッドレスをオフに
            /*
            slowMo: 100
            */
            // 動作を遅く
        };
        const browser = await playwright[browserType].launch(options);
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(URL);
        // page.waitForNavigationが重要なポイントその1です
        await page.waitForNavigation('load');

        // page.waitForSelectorが重要なポイントその2です
        // 遷移先ページに存在する要素を指定します
        // これがないと Protection 突破後、完全にページが切り替わる前に次の処理が走ってしまいます
        await page.waitForSelector('div.content__title')

        // DDoS protection をすり抜けたことを確認
        // await page.screenshot({ path: `ddos-protection-passed.png` });

        const results = await page.$$("div.squadrons-members__grid-item");
        
        let users = [];
        for(let j = 0; j < results.length; j++){
            if(j > 5){
                const text = await results[j].evaluate(e => e.innerText);
                const i = Math.floor(j / 6) - 1;
                console.log(j, i, text);
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
                        // console.log(value.children[0].data.replace(/\s+/g, ''));
                        users[i].nowactive = Number(text);
                        break;
                    case 4:
                        //　console.log(value.children[0].data.replace(/\s+/g, ''));
                        users[i].setrole = [text];
                        break;
                    case 5:
                        //console.log(value.children[0].data.replace(/\s+/g, ''));
                        users[i].setEnter = text;
                        break;
                    default:
                        break;
                }
            }
        }
        await browser.close();
        return users;
    }
}

Scrape.thunderClanTable().then((users)=>{
    users.forEach((user)=>{
        console.log(user);
    });
});
module.exports = {
    Scrape
};

