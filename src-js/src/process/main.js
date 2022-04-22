const mysql = require("mysql2/promise");
const scrape = require('./scrape');
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

async function runEveryDay(){
    // TODO:スクレイピングの実行
    const scList = await scraping();
    
    // TODO:wt_membersにいなければ追加、いれば放置
    const con = await mysql.createConnection(db_setting);
    const listLength = scList.length;
    for(let i = 1; i < listLength; i++){
        const [resultsWTign, field] = await con.query(`SELECT t_ign FROM t_wt_members WHERE t_ign = '${scList[i].player}' LIMIT 1`);
        if(!resultsWTign.length){
            // 基本情報
            await con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at)VALUES ('${list[i].player}',${list[i].roleid},'${list[i].dateOfEntry}')`);
        }
    }
    //await Promise.all([
        // 基本情報
    //    await con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at, t_all_active)VALUES ${hairetu['info']}`),
        // アクティブ情報
    //    con.query(`INSERT INTO wt_actives(t_user_id, wt_active)VALUES ${hairetu['activity']}`)
    //]);
    // TODO:wt_membersがスクレイピングにいなければ, wt_membersの在籍フラグを変更・退室日を記録
    const [rows, fields] = await con.query(`SELECT t_ign FROM t_wt_members`);
    await con.end();
    // console.log(rows);
};

// スクレイピング 
async function scraping(){
    const list = await scrape.fetch(clanInfoURL);
    return list;
}

module.exports = {
    runEveryDay
};