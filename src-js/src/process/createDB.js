const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./data/clandb.sqlite3");

db.serialize(() => {
    /* wotbテーブル */
    db.run(`CREATE TABLE w_wotb_members(
        w_user_id INTEGER PRIMARY KEY,
        w_ign TEXT NOT NULL UNIQUE,
        r_id INTEGER NOT NULL,
        w_enter_at TEXT NOT NULL,
        w_left_at TEXT,
        w_is_flag INTEGER NOT NULL DEFAULT 1
        )`);
    
    /* wtテーブル */
    db.run(`CREATE TABLE t_wt_members
        t_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        t_ign TEXT NOT NULL UNIQUE,
        r_id INTEGER NOT NULL,
        t_enter_at TEXT NOT NULL DEFAULT CURRENT_DATE,
        t_left_at TEXT,
        t_is_flag INTEGER NOT NULL DEFAULT 1
    `);

    /* Discordテーブル */    
    db.run(`CREATE TABLE d_discord_members
        d_user_id INTEGER PRIMARY KEY,
        d_name TEXT NOT NULL,
        w_user_id INTEGER,
        t_user_id INTEGER,
        r_id INTEGER NOT NULL,
        d_nick TEXT,
        d_ign TEXT NOT NULL,
        d_enter_at TEXT NOT NULL,
        d_left_at TEXT,
        d_is_flag INTEGER NOT NULL DEFAULT 1,
        d_sub_id INTEGER
    `);

    /*Roleテーブル*/
    db.run(`CREATE TABLE r_roles
        r_id INTEGER PRIMARY KEY AUTOINCREMENT,
        r_name TEXT NOT NULL UNIQUE
    `);

    /* ロールの追加 */
    db.run(`INSERT INTO r_roles VALUES('クランマスター')`);
    db.run(`INSERT INTO r_roles VALUES('副司令官')`);
    db.run(`INSERT INTO r_roles VALUES('士官')`);
    db.run(`INSERT INTO r_roles VALUES('軍曹')`);
    db.run(`INSERT INTO r_roles VALUES('クランメンバー')`);
    // db.run("drop table if exists members");
    // db.run("create table if not exists members(name,age)");
    // db.run("insert into members(name,age) values(?,?)", "hoge", 33);
    // db.run("insert into members(name,age) values(?,?)", "foo", 44);
    // db.run("update members set age = ? where name = ?", 55, "foo");
    // db.each("select * from members", (err, row) => {
    //     console.log(`${row.name} ${row.age}`);
    // });
    // db.all("select * from members", (err, rows) => {
    //     console.log(JSON.stringify(rows));
    // });
    // db.get("select count(*) from members", (err, count) => {
    //     console.log(count["count(*)"]);
    // })
});

db.close();