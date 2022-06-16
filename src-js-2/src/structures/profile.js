const {shapDatetime} = require('../change-datetime-type/toDatetime');
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
}

module.exports = {
    WotbUser,
    ThunderUser,
    DiscordUser
}