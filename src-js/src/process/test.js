const mysql = require("mysql2/promise");

const db_seting = {
    host: "localhost",
    user: "root",
    password: "Irukainaikairuka4649",
    database: "testdb"
};

(async () => {

    try {

        //内容は各自の環境に合わせて変える
        const con = await mysql.createConnection(db_seting);

        await con.query("drop table if exists members");
        await con.query("create table members(id int, name varchar(32))");
        await con.query("insert into members(id,name) values(?,?)", [1, "hoge"]);
        await con.query("insert into members(id,name) values(?,?)", [2, "foo"]);

        const [rows, fields] = await con.query("select * from members");
        for (const row of rows) {
            console.log(`id=${row.id}, name=${row.name}`);
        }

        await con.end();


    } catch (e) {
        console.log(e);
    }

})();