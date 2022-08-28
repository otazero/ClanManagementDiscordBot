const {shapDatetime} = require('../change-datetime-type/toDatetime');
const {roles} = require('./role');
const {Activestory} = require('./activity');
/* Userクラス */


/**
 * ユーザークラスの基本型
 */
class User {
    constructor() {
        /** @type {?number}  ユーザーID*/
        this.id = null;
        /** @type {?String}  IGN*/
        this.ign = null;
        /** @type {?number}  ロールID*/
        this.role = null;
        /** @type {?String}  入室日*/
        this.enter_at = null;
        /** @type {?String}  退室日*/
        this.left_at = null;
        /** @type {Boolean}  在籍フラグ。Trueでいる。*/
        this.isflag = true;
    }
    /**
     * @param {string[]|number[]} roleinfo APIの結果をリストで渡す
     */
    set setrole(roleinfo){
        this.role = new roles(roleinfo);
    }
    /**
     * @param {number|string} day
     */
    set setEnter(day){
        this.enter_at = new shapDatetime(day); 
    }
    /**
     * @param {number|string} day
     */
    set setLeft(day){
        this.left_at = new shapDatetime(day); 
    }
}

/**
 * WotBユーザークラス
 * @extends User
 */
class WotbUser extends User {
    constructor(){
        super();
    }
}


/**
 * WarThunderユーザークラス
 * @extends User
 */
class ThunderUser extends User {
    constructor(){
        super();
        /** @type {number}  1ヶ月毎のアクティブ*/
        this.nowactive = 0;
        /** @type {number}  総アクティブ*/
        this.allactive = 0;

        /**
         * アクティブ履歴テーブル入れる
         * アクティブ履歴クラス作る?
         * 
         */
        this.activestory = [];
    }
    setActive(){
        this.allactive += this.nowactive;
    }
    /**
     * @param {___Activestory____[]} activities [{}, {}]のようにデータベースの内容をぶち込む
     */
    set setActivestory(activities){
        this.activestory = activities.map((act) => {
            return new Activestory(act);
        });
    }
}

/**
 * Discordユーザークラス
 * @extends User
 */
class DiscordUser extends User {
    constructor(){
        super();
        /** @type {?String}  ユーザー名*/
        this.username = null;
        /** @type {?number}  wotbID*/
        this.wotbid = null;
        /** @type {?number}  WtID*/
        this.thunderid = null;
        /** @type {?String}  ニックネーム*/
        this.nick = null;
        /** @type {?number}  サブ垢ID*/
        this.sub = null;
    }
    /**
     * createdbの戻り値をもとに行う
     * @param {obj} wotbuserclass
     * @param {obj} thunderuserclass
     */
    setgameid(wotbuserclass, thunderuserclass){
        this.role.sub.forEach(role => {
            if(role.name === 'WorldOfTanksBlitz'){
                wotbuserclass.forEach(element => {
                    if(element.ign === this.ign){
                        this.wotbid = element.id;
                    }
                });
            }else if(role.name === 'WarThunder'){
                thunderuserclass.forEach(element => {
                    if(element.ign === this.ign){
                        this.thunderid = element.id;
                    }
                });
            }
        });
    }
}

module.exports = {
    WotbUser,
    ThunderUser,
    DiscordUser
}