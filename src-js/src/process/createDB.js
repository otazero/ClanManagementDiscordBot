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
        
        /* wotbメンバーテーブル */
        await con.query(`
            CREATE TABLE w_wotb_members(
                w_user_id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
                w_ign VARCHAR(16) UNIQUE NOT NULL,
                r_id TINYINT UNSIGNED NOT NULL,
                w_enter_at DATETIME,
                w_left_at DATE,
                w_is_flag BOOLEAN DEFAULT true NOT NULL,
                CONSTRAINT fk_r_id
                    FOREIGN KEY (r_id) 
                    REFERENCES r_roles (r_id)
                    ON DELETE RESTRICT ON UPDATE CASCADE)
        `);
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