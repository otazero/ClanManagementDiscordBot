const mysql = require("mysql2/promise");
const {WotbUser, DiscordUser, ThunderUser} = require('../structures/profile');

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

class OperationDatabase{
    static async oldDatabaseInfo(){
        class SelectDB{
            constructor(){
                this.#select();
            }
            async #select(){
                let mycon = null;
                try {
                    mycon = await mysql.createConnection(db_setting);
                }catch(e){
                    console.log(e);
                }
                const [result, gomi] = await mycon.query(`SELECT * FROM w_wotb_members`);
                const oldWotbUserlist = result.map(user => {
                    let userclass = new WotbUser();
                    userclass.id = result;
                });
                
                console.log(result[0].w_enter_at.getFullYear());
                if( mycon ){
                    mycon.end();
                }
            }
        }
        const test = new SelectDB();
    }
    static async Insert(userclasslist, gamename){
        switch(gamename){
            case "Wotb":
                this.#InsertWotb(userclasslist);
                break;
            case "Thunder":
                break;
            case "Discord":
                break;
            default:
                return 1;
        }
    }
    static async #InsertWotb(userclasslist){
        let mycon = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }
        const enterUsers = [];
        for(const user of userclasslist){
            //const result_1 = await mycon.query(`SELECT w_user_id FROM w_wotb_members WHERE w_user_id = ${user.id}`);
            const result = await mycon.query(`INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at) VALUES (${user.id}, '${user.ign}', ${user.role.main.id}, '${user.enter_at.getDateTime}') ON DUPLICATE KEY UPDATE {w_user_id:user.id, w_ign:user.ign, r_id:user.role.main.id, w_enter_at:user.enter_at.getDateTime}`);
            if(!(result[0].affectedRows===0)){
                enterUsers.push(user);
            }
        }
        console.log(enterUsers);
        const result = await mycon.query(`INSERT INTO w_wotb_members SET ?`, {w_user_id:2, w_ign:"BlackTiger", r_id:4, w_enter_at:'2022-06-19 22:57:30'})
        console.log(result[0]);
        if( mycon ){
            mycon.end();
        }
        return enterUsers;
    }
}

module.exports = {
    OperationDatabase
}