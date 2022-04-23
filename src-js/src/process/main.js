const mysql = require("mysql2/promise");
const request = require('request');
const scrape = require('./scrape');
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
    method: 'POST',
    json: true
}

const clanID = process.env.CLAN_ID;

async function runEveryDay(){
    // TODO:スクレイピングの実行
    const scList = await scraping();
    
    // TODO:wt_membersにいなければ追加、いれば放置
    const con = await mysql.createConnection(db_setting);
    const listLength = scList.length;
    let scIgnList = [];
    for(let i = 1; i < listLength; i++){
        const [resultsWTign, field] = await con.query(`SELECT t_ign FROM t_wt_members WHERE t_ign = '${scList[i].player}' LIMIT 1`);
        if(!resultsWTign.length){
            // 基本情報
            await con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at)VALUES ('${list[i].player}',${list[i].roleid},'${list[i].dateOfEntry}')`);
        }
        scIgnList.push(scList[i].player);
    }
    // TODO:wt_membersがスクレイピングにいなければ, wt_membersの在籍フラグを変更・退室日を記録
    const [rows, fields] = await con.query(`SELECT t_ign FROM t_wt_members`);
    let byebyeWT = [];
    const now = new nowDateTime();
    for(let row of rows){
        if(!scIgnList.includes(row.t_ign)){
            byebyeWT.push(row.t_ign);
            await con.query(`UPDATE t_wt_members SET t_is_flag = 0 , t_left_at = '${now.getDate()}' WHERE t_ign = '${row.t_ign}'`);
        }
    }
    
    
    await con.end();
};

async function test(){
    const wotbJson = await requestPromise(api_options_1);
    const memberDic = wotbJson['data'][`${clanID}`]['members'];
    for(let key in memberDic){
        console.log(memberDic[key]);
    }
}

// スクレイピング 
async function scraping(){
    const list = await scrape.fetch(clanInfoURL);
    return list;
};



/*
const now = new nowDateTime();

console.log(now.getMonth());
console.log(now.getDate());
*/
module.exports = {
    runEveryDay,
    test
};