/*  @蘇生プログラム  */
function cfDecodeEmail(encodedString) {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2){
        i = parseInt(encodedString.substr(n, 2), 16) ^ r;
        email += String.fromCharCode(i);
    }
    return email;
};


exports.abc = function(){
    var fs = require('fs');
    require('dotenv').config();

    var client = require('cheerio-httpcli');

    const URL = process.env.CLAN_SITE;
    
    /* スクレイピング開始 */
    client.fetch(URL, function(e, $, res, body){
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
                    scrapingData[Math.floor(allCount/6)].personalClanRating = lineData;
                    break;
                case 3:
                    scrapingData[Math.floor(allCount/6)].activity = lineData;
                    break;
                case 4:
                    scrapingData[Math.floor(allCount/6)].role = lineData;
                    break;
                case 5:
                    scrapingData[Math.floor(allCount/6)].dateOfEntry = lineData;
                    lineCount = -1;
                    break;
            }
            allCount++;
        });
        /* なぜか値渡しできなかったので... */
        let simpleData = {data: scrapingData};
        fs.writeFile('hoge.json', JSON.stringify(simpleData, null, '    '), (err)=>{
            if(err) console.log(`error!::${err}`);
        });
    });
};