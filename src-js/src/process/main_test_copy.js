const mysql = require("mysql2/promise");
require('dotenv').config();

const db_setting = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clandb',
};

console.log("hi");
(async () => {
    try{
        await scraping();
        const data = require('../../data/scrapingData.json');
        console.log(data.data);
        console.log("3番目");
        try {
            const con = await mysql.createConnection(db_setting);
            console.log("あいうえ");
            await con.end();
        } catch (e) {
            console.log(e);
        }
        console.log(y);
    } catch (e) {
        console.log(e);
    }
})();

/*  @蘇生プログラム  */
function cfDecodeEmail(encodedString) {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2){
        i = parseInt(encodedString.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(i);
    }
    return email;
};

/* 入隊日表示をddmmyyyyからyyyymmddにチェンジ */
function date_change(ddmmyyyy){
    temp = ddmmyyyy.split('.')
    return(temp[2]+"-"+temp[1]+"-"+temp[0])
};

async function scraping(){
    await s2();
};

async function s2(){
    var fs = require('fs');
    require('dotenv').config();

    var client = require('cheerio-httpcli');

    const URL = process.env.CLAN_SITE;
    /* スクレイピング開始 */
    client.fetch(URL,function(e, $, res, body){
        /* エラー表示 */
        if (e) {
            console.error(e);
        }
        /* ps, live勢用 */
        const psTable = $('span.__cf_email__');
        let pslist = []
        psTable.each(function(idx){
            let email = cfDecodeEmail($(this).attr('data-cfemail'));
            if(email.indexOf('@psn') != -1){
                email = email.replace('@psn', '');
            }
            else{
                email = email.replace('@live', '');
            }
            pslist.push(email);
        });
        let allCount = 0;
        let lineCount = -1;
        let psFlagCount = 0;
        let scrapingData = [];
        const table = $('div.squadrons-members__grid-item');
        table.each(function(idx){
            lineCount++;
            const lineData = $(this).text().replace(/\s+/g, '');
            switch(lineCount){
                case 0:
                    scrapingData[allCount/6] = {};
                    scrapingData[Math.floor(allCount/6)].num = lineData;
                    break;
                case 1:
                    if(lineData.indexOf('[emailprotected]') != -1){
                        const ign = lineData.replace("[emailprotected]", "") + pslist[psFlagCount];
                        scrapingData[Math.floor(allCount/6)].player = ign;
                        psFlagCount++;
                    }
                    else{
                        scrapingData[Math.floor(allCount/6)].player = lineData;
                    }
                    break;
                case 2:
                    scrapingData[Math.floor(allCount/6)].personalClanRating = Number(lineData);
                    break;
                case 3:
                    scrapingData[Math.floor(allCount/6)].activity = Number(lineData);
                    break;
                case 4:
                    scrapingData[Math.floor(allCount/6)].role = lineData;
                        switch(lineData){
                            case 'Private':
                                scrapingData[Math.floor(allCount/6)].roleid = 3;
                                break;
                            case 'Commander':
                                scrapingData[Math.floor(allCount/6)].roleid = 1;
                                break;
                            case 'Deputy':
                                scrapingData[Math.floor(allCount/6)].roleid = 2;
                                break;
                            case 'Officer':
                                scrapingData[Math.floor(allCount/6)].roleid = 7;
                                break;
                            case 'Sergeant':
                                scrapingData[Math.floor(allCount/6)].roleid = 8;
                                break;
                        }
                    break;
                case 5:
                    scrapingData[Math.floor(allCount/6)].dateOfEntry = date_change(lineData);
                    lineCount = -1;
                    break;
            }
            allCount++;
        });
        /* なぜか値渡しできなかったので... */
        let simpleData = {data: scrapingData};
        fs.writeFile('./data/scrapingData.json', JSON.stringify(simpleData, null, '    '), (err)=>{
            if(err) console.log(`error!::${err}`);
        });
        console.log("Sした");
    });
};