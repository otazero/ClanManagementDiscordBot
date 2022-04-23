const mysql = require("mysql2/promise");
const scrape = require('./scrape');
const apiRequest = require('./apiRequest');
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

(async () => {

    try {
        // DBに接続
        const con = await mysql.createConnection(db_setting);
        
        // スクレイピングとDBのテーブル作成を並列実行(理想)
        // hairetu = [ スクレイピングのreturn, なし];
        const [wtlist, wotbList, unknown] = await Promise.all([scraping(), wotbApi(clanID, api_options_1),buildDB(con)]);
        // スクレイピングのデータをDBに一括登録
        await Promise.all([
            // WT基本情報
            con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at, t_all_active)VALUES ${wtlist['info']}`),
            // アクティブ情報
            con.query(`INSERT INTO wt_actives(t_user_id, wt_active)VALUES ${wtlist['activity']}`),
            // wotb基本情報
            con.query(`INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at)VALUES ${wotbList}`)
        ]);
        // const [rows, fields] = await con.query("select * from members");
        // for (const row of rows) {
        //     console.log(`id=${row.id}, name=${row.name}`);
        // }
        await con.end();
    } catch (e) {
        console.log(e);
    }

})();

// スクレイピング 
async function scraping(){
    let valuesInfo = '';
    let valuesActive = '';
    const list = await scrape.fetch(clanInfoURL);
    const listLength = list.length;
    // バルクinsertの用意
    // 一個目の要素は表のヘッダーなのでいらない
    for(let i = 1; i < listLength; i++){
        valuesInfo += `('${list[i].player}',${list[i].roleid},'${list[i].dateOfEntry}',${list[i].activity})`;
        valuesActive += `('${i}',${list[i].activity})`;
        if(i !== listLength - 1){
            valuesInfo += ',';
            valuesActive += ',';
        }
    }
    return {info:valuesInfo, activity:valuesActive};
}

// wotbメンバーDB登録
async function wotbApi(id, option){
    const memberList = await apiRequest.apiRequest(id, option);
    const listLength = memberList.length;
    let memberInfo = '';
    for(let i = 0; i < listLength; i++){
        memberInfo += `(${memberList[i].id},'${memberList[i].player}',${memberList[i].roleid},'${memberList[i].dateOfEntry}')`;
        if(i !== listLength - 1){
            memberInfo += ',';
        }
    }
    return memberInfo;
}

// DBのテーブル作成
async function buildDB(con){
    // 並列して5つテーブルを作る(理想)
    await Promise.all([
        /* 役職テーブル */
        con.query(`
            CREATE TABLE IF NOT EXISTS r_roles
            (
                r_id TINYINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
                r_name VARCHAR(10) UNIQUE NOT NULL,
                r_dis_id BIGINT UNIQUE
            )
        `),
        /* wotbメンバーテーブル */
        con.query(`
            CREATE TABLE IF NOT EXISTS w_wotb_members
            (
                w_user_id INT UNSIGNED NOT NULL PRIMARY KEY,
                w_ign VARCHAR(24) UNIQUE NOT NULL,
                r_id TINYINT UNSIGNED NOT NULL,
                w_enter_at DATETIME,
                w_left_at DATE,
                w_is_flag BOOLEAN DEFAULT true NOT NULL,
                INDEX rw_index(r_id),
                CONSTRAINT fk_rw_id
                    FOREIGN KEY (r_id) 
                        REFERENCES r_roles (r_id)
                        ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `),

        /* WTメンバーテーブル */
        con.query(`
            CREATE TABLE IF NOT EXISTS t_wt_members
            (
                t_user_id SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
                t_ign VARCHAR(16) UNIQUE NOT NULL,
                r_id TINYINT UNSIGNED NOT NULL,
                t_enter_at DATE,
                t_left_at DATE,
                t_is_flag BOOLEAN DEFAULT true NOT NULL,
                t_all_active INT DEFAULT 0 NOT NULL,
                INDEX rt_index(r_id),
                CONSTRAINT fk_rt_id_
                    FOREIGN KEY (r_id) 
                        REFERENCES r_roles (r_id)
                        ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `),

        /* Discordメンバーテーブル */
        con.query(`
            CREATE TABLE IF NOT EXISTS d_discord_members
            (
                d_user_id BIGINT NOT NULL PRIMARY KEY,
                d_name VARCHAR(32) NOT NULL,
                w_user_id INT UNSIGNED,
                t_user_id SMALLINT UNSIGNED,
                r_id TINYINT UNSIGNED NOT NULL,
                d_nick VARCHAR(32),
                d_ign VARCHAR(32) NOT NULL,
                d_enter_at DATE NOT NULL,
                d_left_at DATE,
                d_is_flag BOOLEAN DEFAULT true NOT NULL,
                d_sub_id BIGINT UNIQUE,
                
                INDEX wd_index(w_user_id),
                INDEX td_index(t_user_id),
                INDEX rd_index(r_id),
                
                CONSTRAINT fk_rd_id
                    FOREIGN KEY (r_id) 
                        REFERENCES r_roles (r_id)
                        ON DELETE RESTRICT ON UPDATE CASCADE,
                
                CONSTRAINT fk_wd_id
                    FOREIGN KEY (w_user_id) 
                        REFERENCES w_wotb_members (w_user_id)
                        ON DELETE RESTRICT ON UPDATE CASCADE,
                    
                CONSTRAINT fk_td_id
                    FOREIGN KEY (t_user_id) 
                        REFERENCES t_wt_members (t_user_id)
                        ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `),
        /* アクティブテーブル */
        con.query(`
            CREATE TABLE IF NOT EXISTS wt_actives
            (
                t_user_id SMALLINT UNSIGNED NOT NULL PRIMARY KEY,
                wt_active SMALLINT NOT NULL,
                wt_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                INDEX wta_index_index(t_user_id),
                CONSTRAINT fk_wt_active
                    FOREIGN KEY (t_user_id) 
                        REFERENCES t_wt_members (t_user_id)
                        ON DELETE RESTRICT ON UPDATE CASCADE

            )
        `)
    ]);
    // 役職データを登録
    await con.query(`
            INSERT INTO r_roles(r_name, r_dis_id) 
            VALUES  ('クランマスター',491578007392092170),
                    ('副司令官',483571692774621194),
                    ('クランメンバー',558947013744525313),
                    ('元老',483571690429743115),
                    ('ゲスト',746985465269452820),
                    ('自己紹介未済',617291907361538068),
                    ('士官',NULL),
                    ('軍曹',NULL)
    `);
};

/* メモ */

// wotb id : 10桁
// wotb ign: 最大24文字
// wotb enter: timestamp

// WT ign: 最大16文字
// WT enter: 11.09.2020

// discord user_id: 18桁
// discord name: 最大32文字
// discord ign: Wotb or WTに準ずる
// discord enter: date
// discord left: date
// discord role: 18桁