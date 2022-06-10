const mysql = require("mysql2/promise");
const movieScrape = require('./scrape');
require('dotenv').config();

const db_setting = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clandb',
};

const clanInfoURL = process.env.CLAN_SITE;
console.log("hi");
(async () => {
    try{
        const list = await movieScrape.fetch(clanInfoURL);
        const con = await mysql.createConnection(db_setting);
        for(let i = 1; i < list.length; i++){
            await con.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at)VALUES('${list[i].player}',${list[i].roleid},'${list[i].dateOfEntry}')`);
        }
        await con.end();
    } catch (e) {
        console.log(e);
    }
})();