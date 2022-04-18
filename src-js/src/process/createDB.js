const mysql = require("mysql2/promise");
require('dotenv').config();

const db_setting = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clandb',
};

(async () => {

    try {
        const con = await mysql.createConnection(db_setting);

        /* 役職テーブル */
        await con.query(`
            CREATE TABLE r_roles
            (
                r_id TINYINT UNSIGNED AUTOINCREMENT NOT NULL PRIMARY KEY,
                r_name VARCHAR(10) UNIQUE NOT NULL,
                r_dis_id VARCHAR(18) UNIQUE
            )
        `);

        /* wotbメンバーテーブル */
        await con.query(`
            CREATE TABLE w_wotb_members
            (
                w_user_id INT UNSIGNED NOT NULL PRIMARY KEY,
                w_ign VARCHAR(16) UNIQUE NOT NULL,
                r_id TINYINT UNSIGNED NOT NULL,
                w_enter_at DATETIME,
                w_left_at DATE,
                w_is_flag BOOLEAN DEFAULT true NOT NULL,
                CONSTRAINT fk_r_id
                    FOREIGN KEY (r_id) 
                    REFERENCES r_roles (r_id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `);

        /* WTメンバーテーブル */
        await con.query(`
            CREATE TABLE t_wt_members
            (
                t_user_id INT UNSIGNED AUTOINCREMENT NOT NULL PRIMARY KEY,
                t_ign VARCHAR(16) UNIQUE NOT NULL,
                r_id TINYINT UNSIGNED NOT NULL,
                t_enter_at DATE,
                t_left_at DATE,
                t_is_flag BOOLEAN DEFAULT true NOT NULL,
                CONSTRAINT fk_r_id
                    FOREIGN KEY (r_id) 
                    REFERENCES r_roles (r_id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `);

        /* Discordメンバーテーブル */
        await con.query(`
            CREATE TABLE d_discord_members
            (
                d_user_id INT NOT NULL PRIMARY KEY,
                d_name TEXT NOT NULL,
                w_user_id INT UNSIGNED,
                t_user_id INT UNSIGNED,
                r_id TINYINT UNSIGNED NOT NULL,
                d_nick TEXT,
                d_ign TEXT,
                d_enter_at DATE,
                d_left_at DATE,
                d_is_flag BOOLEAN DEFAULT true NOT NULL,
                d_sub_id INT,
                CONSTRAINT fk_r_id
                    FOREIGN KEY (r_id) 
                    REFERENCES r_roles (r_id)
                    ON DELETE RESTRICT ON UPDATE CASCADE
            )
        `)

        // await con.query("insert into members(id,name) values(?,?)", [1, "hoge"]);
        // await con.query("insert into members(id,name) values(?,?)", [2, "foo"]);

        // const [rows, fields] = await con.query("select * from members");
        // for (const row of rows) {
        //     console.log(`id=${row.id}, name=${row.name}`);
        // }

        await con.end();


    } catch (e) {
        console.log(e);
    }

})();

/* メモ */

// wotb id : 
// wotb ign:
// wotb enter: timestamp
// wotb left:

// WT ign: 最大16文字
// WT enter: 11.09.2020

// discord user_id: 
// discord name: 不明
// discord ign: 不明
// discord enter: 
// discord left:
// discord role: 18桁