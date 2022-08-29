const {IntegrationApiRequest} = require('../api-requests/api-requests');
const {OperationDatabase} = require('../operateDatabase/opratedatabase');

/**
 * 非アクティブ且つDIscord未参加抽出 総アクティブに加算+アクティブテーブルにinsert
 */
class Monthly{
    constructor(){
        this.#main();
    }
    #main(){
        
    }
}

/**
 * 入退室者の更新
 */
class Daily{
    constructor(){
        this.#main();
    }
    async #main(){
        // APIリクエストを飛ばして 既存データベースの内容もクラス化
        let [discordusers, wotbusers, thunderusers] = await Promise.all([IntegrationApiRequest.requestDiscord(), IntegrationApiRequest.requestWotb(), IntegrationApiRequest.requestThunder()]);
        // 重複してない人をDBにinsert(新規参加) & 参加者リストを返す
        await OperationDatabase.Daily(wotbusers, thunderusers, discordusers);
        // APIにいない且つDBの在籍フラグがTrueは退室者
    }
}

const test= new Daily();

module.exports = {
    Monthly
}