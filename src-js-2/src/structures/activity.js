const {shapDatetime} = require('../change-datetime-type/toDatetime');

class Activestory{
    /**
     * 
     * @param {*} db [{}, {}]のようにデータベースの内容をぶち込む
     * 
     */
    constructor(db){
        this.activity = db.wt_active;
        this.addDay = new shapDatetime(db.wt_created_at);
    }
}

module.exports = {
    Activestory
}