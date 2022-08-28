// async/await のmysqlモジュール
const mysql = require("mysql2/promise");

const {IntegrationApiRequest} = require('../api-requests/api-requests');

const roleData= require('../../template/roles.json');

// 秘密ファイル
const fs = require('fs');
const ini = require('ini');
const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const db_setting = {
    host: config.Database.host,
    user: config.Database.user,
    password: config.Database.password,
    database: 'clandb',
};

class CreateDataBase{
    constructor(){
        this.#main().then(body => console.log(body));
    }
    async #main(){
        let mycon = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }
        // データベーステーブル作成
        await this.#createTable(mycon);
        // リクエスト送信
        let [discordusers, wotbusers, thunderusers] = await Promise.all([IntegrationApiRequest.requestDiscord(), IntegrationApiRequest.requestWotb(), IntegrationApiRequest.requestThunder()]);
        // ロール情報insert作成
        await this.#insertRoleInfo(mycon);
        // WTテーブルに挿入
        await this.#insertThunderInfo(mycon, thunderusers);
        //DiscordにゲームIDを入れる
        discordusers.forEach(body => body.setgameid(wotbusers, thunderusers));
        //wotb入れる
        await this.#insertWotbInfo(mycon, wotbusers);
        //Disocrd入れる
        await this.#insertDiscordInfo(mycon, discordusers);
        //console.log(discordusers);
        //console.log(wotbusers);
        //console.log(thunderusers);

        if( mycon ){
            mycon.end();
        }
    }
    /**
     * DiscordInfo挿入
     * @param {*} con 
     * @param {*} discordusers 
     */
    async #insertDiscordInfo(con, discordusers){
        let insert = "";
        const length = discordusers.length - 1;
        discordusers.forEach((body, index) => {
            insert += `(${body.id}, '${body.username}', ${body.wotbid}, ${body.thunderid}, ${body.role.main.id}, '${body.nick}', '${body.ign}', '${body.enter_at.getDateTime}')`;
            if(index<length){
                insert += ",";
            }
        });
        await con.query(`INSERT INTO d_discord_members(d_user_id, d_name, w_user_id, t_user_id, r_id, d_nick, d_ign, d_enter_at)VALUES ${insert}`);
    }
    async #insertWotbInfo(con, wotbusers){
        let insert = "";
        const length = wotbusers.length - 1;
        wotbusers.forEach((body, index) => {
            insert += `(${body.id}, '${body.ign}', ${body.role.main.id}, '${body.enter_at.getDateTime}')`;
            if(index<length){
                insert += ",";
            }
        });
        await con.query(`INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at) VALUES ${insert}`)
    }
    /**
     * WTinfo挿入
     * @param {*} con 
     * @param {*} thunderusers 
     */
    async #insertThunderInfo(con, thunderusers){
        await Promise.all(thunderusers.map(async body => {
            //allアクティブにnowアクティブを加算
            body.setActive();
            const result = await con.query(`INSERT INTO t_wt_members set ?`, {t_ign:body.ign, r_id:body.role.main.id, t_enter_at:body.enter_at.getDate, t_all_active:body.allactive});
            await con.query(`INSERT INTO wt_actives set ?`, {t_user_id:result[0].insertId, wt_active:body.nowactive});
            body.id = result[0].insertId;
        }));
    }
    /**
     * ロール情報insert作成
     */
    async #insertRoleInfo(con){
        let insert = "";
        const length = roleData.length - 1;
        roleData.forEach((body, index) => {
            insert += `(${body.id}, '${body.name}', '${body.discordid}')`;
            if(index<length){
                insert += ",";
            }
        });
        await con.query(`
            INSERT INTO r_roles(r_id, r_name, r_dis_id) 
            VALUES  ${insert}
        `);
    }
    /**
     * DBのテーブル作成
     */
    async #createTable(con){
        // 並列して5つテーブルを作る(理想)
        await Promise.all([
            /* 役職テーブル */
            con.query(`
                CREATE TABLE IF NOT EXISTS r_roles
                (
                    r_id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
                    r_name VARCHAR(20) UNIQUE NOT NULL,
                    r_dis_id VARCHAR(18)
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
                    d_enter_at DATETIME NOT NULL,
                    d_left_at DATETIME,
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
    }
}

const test = new CreateDataBase();