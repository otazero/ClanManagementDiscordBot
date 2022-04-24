const mysql = require("mysql2/promise");
const scrape = require('./scrape');
const apiRequest = require('./apiRequest');
const otherModule = require('./otherModule');
const  nowDateTime = require("./makeDateTime");
require('dotenv').config();

// メンバー一覧表示サイトURL
const clanInfoURL = process.env.CLAN_SITE;


// DBのログインに必要な情報
const db_setting = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clandb',
};

// APIオプション
const api_options_1 = {
    url: process.env.WG_API_1,
    method: 'GET',
    json: true
}

const clanID = process.env.CLAN_ID;

async function runEveryDay(){
    const con = await mysql.createConnection(db_setting);
    
    const [WtDic, WotbDic] = await Promise.all([runEveryDayScrape(con), runEveryDayWotbApi(clanID, api_options_1, con)]);
    console.log(WotbDic);
    console.log(WtDic);
    
    await con.end();
};

async function test(){
    const con = await mysql.createConnection(db_setting);
    
    await runEveryDayWotbApi(clanID, api_options_1, con);

    await con.end();
}

async function  runEveryDayScrape(con){
    // TODO:スクレイピングの実行・
    const scList = await scrape.fetch(clanInfoURL);
    const listLength = scList.length;
    let scIgnList = [];
    // TODO:wt_membersにいなければ追加、いれば放置
    let insertStr = '';
    let insertFlag = false;
    let helloWt = [];
    for(let i = 1; i < listLength; i++){
        const [resultsWTign, field] = await con.query(`SELECT t_ign FROM t_wt_members WHERE t_ign = '${scList[i].player}' LIMIT 1`);
        if(!resultsWTign.length){
            // 基本情報
            insertStr += `('${scList[i].player}',${scList[i].roleid},'${scList[i].dateOfEntry}'),`;
            insertFlag = true;
            helloWt.push({ign:scList[i].player, id:null, reFlag:false});
        }
        scIgnList.push(scList[i].player);
    }
    if(insertFlag){
        await con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at)VALUES ${insertStr.slice(0,-1)}`);
    }
    for(value of helloWt){
        if(value.id==null){
            const [pk, field] =  await con.query(`SELECT t_user_id FROM t_wt_members WHERE t_ign = '${value.ign}' LIMIT 1`);
            value.id = pk[0].t_user_id;
        }
    }
    // TODO:wt_membersがスクレイピングにいなければ, wt_membersの在籍フラグを変更・退室日を記録
    const [rows, fields] = await con.query(`SELECT t_user_id, t_ign, t_enter_at, t_is_flag FROM t_wt_members`);
    let byebyeWt = [];
    const now = new nowDateTime();
    for(let row of rows){
        // スクレイピングに含まれない且つ在籍フラグがTrueのみ
        const bunkiFlag = scIgnList.includes(row.t_ign);
        if(!(bunkiFlag) && row.t_is_flag){
            byebyeWt.push({id:row.t_user_id, ign:row.t_ign, enter_at:row.t_enter_at});
            await con.query(`UPDATE t_wt_members SET t_is_flag = 0 , t_left_at = '${now.getDate()}' WHERE t_user_id = '${row.t_user_id}'`);
        }else if(bunkiFlag && !(row.t_is_flag)){
            helloWt.push({ign:row.t_ign, id:row.t_user_id, reFlag:true});
            await con.query(`UPDATE t_wt_members SET t_is_flag = 1 WHERE t_user_id = '${row.t_user_id}'`);
        }
    }
    return {enter:helloWt, lefter:byebyeWt};
}

async function  runEveryDayWotbApi(id, option, con){
    // TODO: メンバーリスト問い合わせ
    const wotbJson = await apiRequest.wotbApiRequest2(option);
    const memberids = wotbJson['data'][id]['members_ids'];
    // DB登録者確認
    const [isMemberIdListRaw, field] = await con.query(`SELECT w_user_id, w_ign, w_enter_at, w_is_flag FROM w_wotb_members WHERE w_user_id`);
    // TODO: w_wotb_membersがjsonにいなければ在籍フラグを変更・退室日を記録
    const now = new nowDateTime();
    let byebyeWotb = [];
    let isMemberIdListEdit = [];
    let helloWotb = [];
    for(row of isMemberIdListRaw){
        isMemberIdListEdit.push(row.w_user_id);
        const bunkiFlag = memberids.includes(row.w_user_id);
        if(!(bunkiFlag) && row.w_is_flag){
            byebyeWotb.push({id:row.w_user_id, ign:row.w_ign, enter_at:row.w_enter_at});
            await con.query(`UPDATE w_wotb_members SET w_is_flag = 0 , w_left_at = '${now.getDate()}' WHERE w_user_id = '${row.w_user_id}'`);
        }else if(bunkiFlag && !(row.w_is_flag)){
            helloWotb.push({ign:row.w_ign, id:row.w_user_id, reFlag:true});
            await con.query(`UPDATE w_wotb_members SET w_is_flag = 1 WHERE w_user_id = '${row.w_user_id}'`);
        }
    }
    // TODO: w_wotb_membersにいなければ追加, いれば放置
    let insertStr = '';
    let insertFlag = false;
    for(row of memberids){
        if(!isMemberIdListEdit.includes(row)){
            const memberInfo = wotbJson['data'][id]['members'][row]
            insertStr += `(${row},'${memberInfo.account_name}',${otherModule.wotbroleToDiscordrole(memberInfo.role)},'${timestampToTime(memberInfo.joined_at).replace(/\//g, '-')}'),`;
            insertFlag = true;
            helloWotb.push({ign:memberInfo.account_name, id:row, reFlag:false});
        }
    }
    if(insertFlag){
        await con.query(`INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at)VALUES ${insertStr.slice(0,-1)}`);
    }
    return {enter:helloWotb, lefter:byebyeWotb};
}

function timestampToTime(t){
    return new Date(t * 1000)
        .toLocaleDateString('ja', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
}

/*
const now = new nowDateTime();

console.log(now.getMonth());
console.log(now.getDate());
*/
module.exports = {
    runEveryDay,
    test
};