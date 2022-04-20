
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
            let scrapingData = {};
            const table = $('div.squadrons-members__grid-item');
            table.each(function(idx){
                lineCount++;
                const lineData = $(this).text().replace(/\s+/g, '');
                switch(lineCount){
                    case 0:
                        scrapingData.num = lineData;
                        break;
                    case 1:
                        if(lineData.indexOf('[emailprotected]') != -1){
                            const ign = lineData.replace("[emailprotected]", "") + pslist[psFlagCount];
                            scrapingData.player = ign;
                            psFlagCount++;
                        }
                        else{
                            scrapingData.player = lineData;
                        }
                        break;
                    case 2:
                        scrapingData.personalClanRating = lineData;
                        break;
                    case 3:
                        scrapingData.activity = lineData;
                        break;
                    case 4:
                        scrapingData.role = lineData;
                        switch(lineData){
                            case 'Private':
                                scrapingData.roleid = 3;
                                break;
                            case 'Commander':
                                scrapingData.roleid = 1;
                                break;
                            case 'Deputy':
                                scrapingData.roleid = 2;
                                break;
                            case 'Officer':
                                scrapingData.roleid = 7;
                                break;
                            case 'Sergeant':
                                scrapingData.roleid = 8;
                                break;
                        }
                        break;
                    case 5:
                        scrapingData.dateOfEntry = date_change(lineData);
                        (async () => {
                            await con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at)VALUES(${scrapingData.player},${scrapingData.roleid},${scrapingData.dateOfEntry})`);
                            const [rows, fields] = await con.query("SELECT LAST_INSERT_ID()");
                            console.log(rows);
                            console.log("テスト");
                            for (const val of rows) {
                                console.log(val);
                            }
                        })();
                        // console.log(scrapingData);
                        lineCount = -1;
                        break;
                }
                // await con.query(`INSERT INTO wt_actives(t_user_id, wt_active)VALUES(${},${})`);
                allCount++;
            });
        });

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
            return(temp[2]+"."+temp[1]+"."+temp[0])
        };