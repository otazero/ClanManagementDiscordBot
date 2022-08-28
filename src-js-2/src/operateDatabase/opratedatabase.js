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
    /**
     * 
     * @param {*} newusers APIの結果(ユーザークラス)を渡します 
     */
    static async Daily(wotbNewusers, thunderNewusers){
        let mycon = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }

        /** Wotb **/
        const wotbDaily = (async(mycon, newusers)=>{
            //データベースから存在フラグがTrueのだけ受け取ります
            const [oldusers, gomi] = await mycon.query(`SELECT * FROM w_wotb_members NATURAL INNER JOIN r_roles WHERE w_is_flag = true `);
            
            //退室者を考えます
            const lefters = ((olds, news) => {
                let result = [];
                olds.forEach(older => {
                    let isflag = false;
                    news.forEach(newer =>{
                        if(newer.id == older.w_user_id){
                            isflag = true;
                        }
                    });
                    if(!isflag){
                        //ユーザークラス化
                        let user = new WotbUser();
                        user.id = older.w_user_id;
                        user.ign = older.w_ign;
                        user.setrole = [older.r_dis_id];
                        user.setEnter = older.w_enter_at;
                        if(older.w_left_at){
                            user.setLeft = older.w_left_at;
                        }
                        result.push(user);
                    }
                });
                return result;
            })(oldusers, newusers);
            //入室者を考えます
            const enters = ((olds, news) => {
                let result = [];
                news.forEach(newer => {
                    let isflag = false;
                    olds.forEach(older =>{
                        if(newer.id == older.w_user_id){
                            isflag = true;
                        }
                    });
                    if(!isflag){
                        result.push(newer);
                    }
                });
                return result;
            })(oldusers, newusers);
            /*
            console.log("退室");
            console.log(lefters);
            console.log("入室");
            console.log(enters);
            */
            //退室者に関するデータベース操作
            if(lefters.length){
                (async(mycon)=> {
                    let text = '';
                    lefters.forEach(lefter => {
                        text += `w_user_id = ${lefter.id} or `;
                    });
                    const q_text = text.slice(0, -3);
                    const [result, gomi] = await mycon.query(`UPDATE w_wotb_members SET w_is_flag = false WHERE ${q_text}`);
                })(mycon);
            }
            //入室者に関するデータベース操作
            if(enters.length){
                (async(mycon)=> {
                    let text = '';
                    enters.forEach(enter => {
                        text += `(${enter.id}, '${enter.ign}', ${enter.role.main.id}, '${enter.enter_at.getDateTime}', true),`;
                    });
                    const q_text = text.slice(0, -1);;
                    const [result, gomi] = await mycon.query(`INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at, w_is_flag) VALUES ${q_text} AS new ON DUPLICATE KEY UPDATE w_is_flag = new.w_is_flag`);
                })(mycon);
            }
            return {lefters:lefters, enters:enters};
        })(mycon, wotbNewusers);
        
        /** WarThunder **/
        
        if( mycon ){
            mycon.end();
        }
    }
}

module.exports = {
    OperationDatabase
}