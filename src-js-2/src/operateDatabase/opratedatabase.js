const mysql = require("mysql2/promise");
const {WotbUser, DiscordUser, ThunderUser} = require('../structures/profile');
const {shapDatetime} = require('../change-datetime-type/toDatetime');
const {role}= require('../structures/role.js');

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
    supportBigNumbers: true, // BigNumberサポート有効化
    bigNumberStrings: true, // BigNumberを文字列として扱う
};

class OperationDatabase{
    /**
     * 
     * @param {*} newusers APIの結果(ユーザークラス)を渡します 
     */
    static async Daily(wotbNewusers, thunderNewusers, discordNewusers){

        /** Wotb **/
        const wotbDaily = (async(newusers)=>{
            let mycon = null;
            try {
                mycon = await mysql.createConnection(db_setting);
            }catch(e){
                console.log(e);
            }
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
                        user.isflag = false;
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
            
            //退室者に関するデータベース操作
            if(lefters.length){
                (async(mycon)=> {
                    let text = '';
                    lefters.forEach(lefter => {
                        text += `w_user_id = ${lefter.id} or `;
                    });
                    const q_text = text.slice(0, -3);
                    const day = new shapDatetime();
                    const [result, gomi] = await mycon.query(`UPDATE w_wotb_members SET w_is_flag = false, w_left_at = '${day.getDateTime}' WHERE ${q_text}`);
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
                    const [result, gomi] = await mycon.query(`INSERT INTO w_wotb_members(w_user_id, w_ign, r_id, w_enter_at, w_is_flag) VALUES ${q_text} ON DUPLICATE KEY UPDATE w_is_flag = VALUES(w_is_flag)`);
                })(mycon);
            }
            if( mycon ){
                mycon.end();
            }
            return {lefters:lefters, enters:enters};
        })(wotbNewusers);
        
        /** WarThunder **/
        const thunderDaily = (async(newusers)=>{
            let mycon = null;
            try {
                mycon = await mysql.createConnection(db_setting);
            }catch(e){
                console.log(e);
            }
            
            //データベースから存在フラグがTrueのだけ受け取ります
            const [oldusers, gomi] = await mycon.query(`SELECT * FROM t_wt_members NATURAL INNER JOIN r_roles WHERE t_is_flag = true `);
            //退室者を考えます
            const lefters = ((olds, news) => {
                let result = [];
                olds.forEach(older => {
                    let isflag = false;
                    news.forEach(newer =>{
                        if(newer.ign == older.t_ign){
                            isflag = true;
                        }
                    });
                    if(!isflag){
                        //ユーザークラス化
                        let user = new ThunderUser();
                        user.id = older.t_user_id;
                        user.ign = older.t_ign;
                        user.setrole = [older.r_dis_id];
                        user.setEnter = older.t_enter_at;
                        if(older.t_left_at){
                            user.setLeft = older.t_left_at;
                        }
                        user.allactive = older.t_all_active;
                        user.isflag = false;
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
                        if(newer.ign == older.t_ign){
                            isflag = true;
                        }
                    });
                    if(!isflag){
                        result.push(newer);
                    }
                });
                return result;
            })(oldusers, newusers);
            
            //退室者に関するデータベース操作
            if(lefters.length){
                (async(mycon)=> {
                    let text = '';
                    lefters.forEach(lefter => {
                        text += `t_user_id = ${lefter.id} or `;
                    });
                    const q_text = text.slice(0, -3);
                    const day = new shapDatetime();
                    const [result, gomi] = await mycon.query(`UPDATE t_wt_members SET t_is_flag = false, t_left_at = '${day.getDateTime}' WHERE ${q_text}`);
                })(mycon);
            }
            //入室者に関するデータベース操作
            if(enters.length){
                await Promise.all(enters.map(async(user) => {
                    const [result, gomi] = await mycon.query(`INSERT INTO t_wt_members(t_ign, r_id, t_enter_at, t_is_flag) VALUES ('${user.ign}', ${user.role.main.id}, '${user.enter_at.getDateTime}', true) ON DUPLICATE KEY UPDATE t_is_flag = VALUES(t_is_flag)`);
                    user.id = result.insertId;
                    return 0;
                }));       
            }
            
            
            if( mycon ){
                mycon.end();
            }
            return {lefters:lefters, enters:enters};
        })(thunderNewusers);
        const [dailyWotb, dailyThunder] = await Promise.all([wotbDaily, thunderDaily]);
        /** Discord **/
        /**
         * ※Discord入室者の把握
         *  入室者とWT・WotBの紐づけ
         * ※Discord退室者の把握
         *  在籍をflaseにするだけ
         * ※ゲーム退室者を元老に降格(main)
         * ※ゲーム入室者をクランメンバーに昇格(main)
         */
        const discordDaily = (async(newusers)=>{
            let mycon = null;
            try {
                mycon = await mysql.createConnection(db_setting);
            }catch(e){
                console.log(e);
            }
            //データベースから存在フラグがTrueのだけ受け取ります
            const [oldusers, gomi] = await mycon.query(`SELECT * FROM d_discord_members NATURAL INNER JOIN r_roles WHERE d_is_flag = true`);
            //退室者を考えます
            const leftersP = (async(olds, news) => {
                const result = [];
                for(let older of olds){
                    let isflag = false;
                    news.forEach(newer =>{
                        if(newer.id == older.d_user_id){
                            isflag = true;
                        }
                    });
                    if(!isflag){
                        //ユーザークラス化
                        let user = new DiscordUser();
                        user.id = older.d_user_id;
                        user.ign = older.d_ign;
                        user.setrole = [older.r_dis_id];
                        user.setEnter = older.d_enter_at;
                        if(older.d_left_at){
                            user.setLeft = older.d_left_at;
                        }
                        user.username = older.d_name;
                        user.nick = older.d_nick;
                        user.isflag = false;
                        user.subign = older.d_subign;
                        user.upignFlag = older.d_upign_flag;
                        if(older.w_user_id){
                            const [wotbUsers, gomi1] = await mycon.query(`SELECT * FROM w_wotb_members WHERE w_user_id = ${older.w_user_id}`);
                            const wotbUser = await this.#dbToUsers(wotbUsers);
                            user.wotbClass = wotbUser[0];
                        }
                        if(older.t_user_id){
                            const [thunderUsers, gomi2] = await mycon.query(`SELECT * FROM t_wt_members WHERE t_user_id = ${older.t_user_id}`);
                            const thunderUser = await this.#dbToUsers(thunderUsers);
                            user.thunderClass = thunderUser[0];
                        }
                        if(older.d_sub_id){
                            const [discordUsers, gomi3] = await mycon.query(`SELECT * FROM w_wotb_members WHERE w_user_id = ${Number(older.d_sub_id)}`);
                            const discordUser = await this.#dbToUsers(discordUsers);
                            user.subClass = discordUser[0];
                        }
                        result.push(user);
                    }
                }
                
                return result;
            })(oldusers, newusers);
            //入室者を考えます
            const enters = ((olds, news) => {
                let result = [];
                news.forEach(newer => {
                    let isflag = false;
                    olds.forEach(older =>{
                        if(newer.id == older.d_user_id){
                            isflag = true;
                        }
                    });
                    if(!isflag){
                        result.push(newer);
                    }
                });
                return result;
            })(oldusers, newusers);
            
            const lefters = await leftersP;
            // 退室者のデータベース操作
            if(lefters.length){
                let text = '';
                lefters.forEach(lefter => {
                    text += `d_user_id = ${BigInt(lefter.id)} or `;
                });
                const q_text = text.slice(0, -3);
                const day = new shapDatetime();
                await mycon.query(`UPDATE d_discord_members SET d_is_flag = false, d_left_at = '${day.getDateTime}' WHERE ${q_text}`);
            }
            // 入室者のデータベース操作
            if(enters.length){
                let text = '';
                enters.forEach(enter => {
                    text += `(${BigInt(enter.id)}, '${enter.username}', '${enter.ign}', '${enter.nick}', ${enter.role.main.id}, '${enter.enter_at.getDateTime}', true),`;
                });
                const q_text = text.slice(0, -1);
                const [result, gomi] = await mycon.query(`INSERT INTO d_discord_members(d_user_id, d_name, d_ign, d_nick, r_id, d_enter_at, d_is_flag) VALUES ${q_text} ON DUPLICATE KEY UPDATE d_is_flag = VALUES(d_is_flag)`);
            }
            

            /**
            * ※データベースのdiscord ignを最新にする〇
            * ※WTとWotbをDiscordと紐づける〇
            */
            const toChanges = await Promise.all(newusers.map(async(user)=>{
                const [sub, gomi6] = await mycon.query(`SELECT d_subign, d_upign_flag FROM d_discord_members WHERE d_ign = '${user.id}'`);
                const [thunder, gomi4] = await mycon.query(`SELECT * FROM t_wt_members NATURAL INNER JOIN r_roles WHERE t_ign = '${user.ign}'`);
                const [wotb, gomi5] = await mycon.query(`SELECT * FROM w_wotb_members NATURAL INNER JOIN r_roles WHERE w_ign = '${sub.d_upign_flag?sub.d_subign:user.ign}'`);
                if(wotb.length){
                    const temp = user.wotbClass = await this.#dbToUsers(wotb);
                    user.wotbClass = temp[0];
                }
                if(thunder.length){
                    const temp = await this.#dbToUsers(thunder);
                    user.thunderClass = temp[0];
                }
                // 適性ロールに
                const rightDiscordRole = ((user)=>{
                    let toChange = {user:user, change:"no"};
                    if(user.wotbClass.isflag || user.thunderClass.isflag){
                        if((user.role.main.id == 3 || user.role.main.id == 5) || user.role.main.id == 6){
                            toChange.change = "toClanmem";
                            user.role.main = new role(roleData[3]);
                            return toChange;
                        }
                    }
                    else{
                        if(user.role.main.id == 4){
                            toChange.change = "toGenro";
                            user.role.main = new role(roleData[2]);
                            return toChange;
                        }
                    }
                })(user);
                
                await mycon.query(`UPDATE d_discord_members SET d_name = '${user.username}', d_nick = '${user.nick}', d_ign = '${user.ign}', w_user_id = ${user.wotbClass.id}, t_user_id = ${user.thunderClass.id}, r_id = ${user.role.main.id} WHERE d_user_id = ${BigInt(user.id)}`);
                return rightDiscordRole;
            }));
            
            

            if( mycon ){
                mycon.end();
            }
            return {lefters:lefters, enters:enters, roleChange:toChanges.filter(Boolean)};
        })(discordNewusers);
        
        const dailyDiscord = await discordDaily;
        
        return [dailyWotb, dailyThunder, dailyDiscord];
    }

    /**
     * slashコマンドのprofile
     * @param {Number} discorduserid 
     * @returns 
     */
    static async getProfile(discorduserid){
        let mycon = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }

        const [result, gomi] = await mycon.query(`SELECT d_user_id, d_enter_at, d_ign, t_ign, w_ign, t_wt_members.r_id as t_r_id, w_wotb_members.r_id as w_r_id, t_enter_at, w_enter_at FROM d_discord_members  LEFT JOIN t_wt_members ON t_wt_members.t_user_id = d_discord_members.t_user_id LEFT JOIN w_wotb_members ON w_wotb_members.w_user_id = d_discord_members.w_user_id WHERE d_user_id = ${BigInt(discorduserid)} LIMIT 1`);

        if( mycon ){
            mycon.end();
        }

        return result;
    }
    /**
     * 
     * @param {*} dbusers SELECTの一個目のResultをぶち込む 
     */
    static async #dbToUsers(dbusers){
        if(!dbusers.length){
            return [];
        }
        // どのテーブルか判断する
        if(Object.keys(dbusers[0]).includes('d_user_id')){
            const discordClasses = (async(dbusers)=>{
                let mycon = null;
                try {
                    mycon = await mysql.createConnection(db_setting);
                }catch(e){
                    console.log(e);
                }
                const classUsers = await Promise.all(dbusers.map(async(dbuser)=>{
                    let user = new DiscordUser();
                    user.id = dbuser.d_user_id;
                    user.ign = dbuser.d_ign;
                    user.setrole = [dbuser.r_dis_id];
                    user.setEnter = dbuser.d_enter_at;
                    if(dbuser.d_left_at){
                        user.setLeft = dbuser.d_left_at;
                    }
                    user.username = dbuser.d_name;
                    user.nick = dbuser.d_nick;
                    user.subign = dbuser.d_subign;
                    user.upignFlag = dbuser.d_upign_flag;
                    user.wotbClass = new WotbUser();
                    user.thunderClass = new ThunderUser();
                    user.subClass = new DiscordUser();
                    if(dbuser.w_user_id){
                        const [wotbUsers, gomi1] = await mycon.query(`SELECT * FROM w_wotb_members WHERE w_user_id = ${dbuser.w_user_id}`);
                        const wotbUser = await this.#dbToUsers(wotbUsers);
                        user.wotbClass = wotbUser[0];
                    }
                    if(dbuser.t_user_id){
                        const [thunderUsers, gomi2] = await mycon.query(`SELECT * FROM t_wt_members WHERE t_user_id = ${dbuser.t_user_id}`);
                        const thunderUser = await this.#dbToUsers(thunderUsers);
                        user.thunderClass = thunderUser[0];
                    }
                    user.isflag = dbuser.d_is_flag;
                    if(dbuser.d_sub_id){
                        const [discordUsers, gomi3] = await mycon.query(`SELECT * FROM d_discord_members WHERE d_user_id = ${BigInt(dbuser.d_sub_id)}`);
                        const discordUser = await this.#dbToUsers(discordUsers);
                        user.subClass = discordUser[0];
                    }
                    return user;
                }));
                if( mycon ){
                    mycon.end();
                }
                return classUsers;
            })(dbusers);
            return await discordClasses;
        }
        else if(Object.keys(dbusers[0]).includes('w_user_id')){
            const wotbClasses = (async(dbusers)=>{
                let mycon = null;
                try {
                    mycon = await mysql.createConnection(db_setting);
                }catch(e){
                    console.log(e);
                }
                const classUsers = await Promise.all(dbusers.map(async(dbuser)=>{
                    let user = new WotbUser();
                    user.id = dbuser.w_user_id;
                    user.ign = dbuser.w_ign;
                    user.setrole = [dbuser.r_dis_id];
                    user.setEnter = dbuser.w_enter_at;
                    if(dbuser.w_left_at){
                        user.setLeft = dbuser.w_left_at;
                    }
                    user.isflag = dbuser.w_is_flag;
                    return user;
                }));
                if( mycon ){
                    mycon.end();
                }
                return classUsers;
            })(dbusers);
            return await wotbClasses;
        }
        else if(Object.keys(dbusers[0]).includes('t_user_id')){
            const thunderClasses = (async(dbusers)=>{
                let mycon = null;
                try {
                    mycon = await mysql.createConnection(db_setting);
                }catch(e){
                    console.log(e);
                }
                const classUsers = await Promise.all(dbusers.map(async(dbuser)=>{
                    const [result, gomi] = await mycon.query(`SELECT * FROM wt_actives WHERE t_user_id = ${dbuser.t_user_id}`);
                    let user = new ThunderUser();
                    user.id = dbuser.t_user_id;
                    user.ign = dbuser.t_ign;
                    user.setrole = [dbuser.r_dis_id];
                    user.setEnter = dbuser.t_enter_at;
                    if(dbuser.t_left_at){
                        user.setLeft = dbuser.t_left_at;
                    }
                    user.allactive = dbuser.t_all_active;
                    user.isflag = dbuser.t_is_flag;
                    user.setActivestory = result;
                    return user;
                }));
                if( mycon ){
                    mycon.end();
                }
                return classUsers;
            })(dbusers);
            
            return await thunderClasses;
        }
        else{
            console.log("bak-ka");
            return "err";
        }
        
    }
    /**
     * 
     * @param {*} thunderUser 
     * @param {*} discordUser 
     */
    static async Monthly(thunderUser, discordUser){
        let mycon = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }
        // 最期に追加されてから30日後か確かめる
        const [result, gomi] = await mycon.query(`SELECT COUNT(*) AS count_is FROM wt_actives WHERE CURRENT_DATE() >= DATE(DATE_ADD((SELECT MAX(wt_created_at) FROM wt_actives), INTERVAL 30 DAY))`);
        // const [result, gomi] = await mycon.query(`SELECT COUNT(*) AS count_is FROM wt_actives WHERE "2022-12-09" >= DATE(DATE_ADD((SELECT MAX(wt_created_at) FROM wt_actives), INTERVAL 30 DAY))`);
        if( mycon ){
            mycon.end();
        }
        if(Number(result[0].count_is)){
            console.log("アクテビティ更新します");
            this.#UpdateActivity(thunderUser);
            console.log("キックメンバー抽出します");
            return this.LetLeftUser(thunderUser, discordUser);
        }
        else{
            console.log("30日経ってないよ");
        }
    }

    static async #UpdateActivity(thunderUser){
        let mycon = null;
        try {
            mycon = await mysql.createConnection(db_setting);
        }catch(e){
            console.log(e);
        }
        const [dbThunder, gomi] = await mycon.query(`SELECT * FROM t_wt_members`);
        const thunder = await this.#dbToUsers(dbThunder);
        const q_text = ((thunderUser, thunder)=>{
            let text = "";
            thunderUser.forEach((user)=>{
                thunder.forEach((tuser)=>{
                    if(tuser.ign === user.ign){
                        user.id = tuser.id;
                        text += `(${user.id}, ${user.nowactive}), `;

                        user.allactive = tuser.allactive + user.nowactive;
                    }
                });
            });
            return text.slice(0, -2);
        })(thunderUser, thunder);
        const [result1, gomi1] = await mycon.query(`INSERT INTO wt_actives(t_user_id, wt_active) VALUES ${q_text}`);
        await Promise.all(thunderUser.map(async(user)=>{
            await mycon.query(`UPDATE t_wt_members SET t_all_active = ${user.allactive} WHERE t_user_id = ${user.id}`);
        }));
        if( mycon ){
            mycon.end();
        }
    }

    /**
     * アクティビティキックメンバー算出
     * @param {*} thunderUser 
     * @param {*} discordUser 
     * @returns {thunderClass[]} 
     */
    static async LetLeftUser(thunderUser, discordUser){
        const now = new Date();
        now.setDate(now.getDate() - Number(config.KickMember.progress));
        const kickMembers = thunderUser.map((tuser)=>{
            //　アクティビティがX以下の人を抽出
            if(tuser.nowactive <= config.KickMember.minactivity){
                // 入隊後N日数経過したフレンズのみ適用します
                if(tuser.enter_at.getDateType < now){
                    // Discordにもいません
                    if(!(discordUser.some((duser)=>{return duser.ign===tuser.ign}))){
                        return tuser;
                    }
                }
            }
        }).filter(Boolean);
        return kickMembers;
    }

    
}


module.exports = {
    OperationDatabase
}