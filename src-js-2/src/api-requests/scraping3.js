const fs = require('fs');
const ini = require('ini');
const {ThunderUser} = require('../structures/profile');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const URL = encodeURI(`https://warthunder.com/en/community/claninfo/${config.ThunderConfig.clanname}`);

// puppeteer-extra は puppeteer のドロップイン置き換えです。
// インストール済みの puppeteer にプラグイン機能を追加します。
const puppeteer = require('puppeteer-extra')

const puppeteerConfig = require('./browser/browser.config');

// puppeteer usage as normal
const main = async ()=>{
    puppeteerConfig.remodelingPuppeteer(puppeteer);
    const browser = await puppeteer.launch(puppeteerConfig.option);
    console.log('Running tests..');
    const page = await browser.newPage();
    await page.goto(URL);
    // page.waitForNavigationが重要なポイントその1です
    await page.waitForNavigation('load');
    // page.waitForSelectorが重要なポイントその2です
    // 遷移先ページに存在する要素を指定します
    // これがないと Protection 突破後、完全にページが切り替わる前に次の処理が走ってしまいます
    await page.waitForSelector('div.content__title');
    
    // DDoS protection をすり抜けたことを確認
    // await page.screenshot({ path: 'testresult.png', fullPage: true });
    
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
    console.log(`実行時間は ${(endTime - startTime)/1000} 秒です\n`);
}); 