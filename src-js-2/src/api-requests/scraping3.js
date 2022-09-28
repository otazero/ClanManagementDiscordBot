const fs = require('fs');
const ini = require('ini');
const { PassThrough } = require("stream");
const {ThunderUser} = require('../structures/profile');
const { throws } = require('assert');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const URL = encodeURI(`https://warthunder.com/en/community/claninfo/${config.ThunderConfig.clanname}`);

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// puppeteer usage as normal
const main = async ()=>{
    const browser = await puppeteer.launch({ headless: false });
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto('https://warthunder.com/en/community/claninfo/Schwarz%20Ritter')
        await page.waitForNavigation('load');
        await page.waitForSelector('div.content__title');
        // await page.waitForTimeout(100000)
        await page.screenshot({ path: 'testresult.png', fullPage: true });

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
        console.log(`All done, check the screenshot. ✨`);
        return users;
};


const startTime = performance.now();
main().then((users)=>{
    const endTime = performance.now();
    console.log(users);
    console.log(`実行時間は ${(endTime - startTime)/1000} 秒です\n`);
}); 