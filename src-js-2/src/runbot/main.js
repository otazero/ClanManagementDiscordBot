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
        const [dailyWotb, dailyThunder, dailyDiscord] = await OperationDatabase.Daily(wotbusers, thunderusers, discordusers);
        
        console.log("wotb退室");
        console.log(dailyWotb.lefters);
        console.log("wotb入室");
        console.log(dailyWotb.enters);
        console.log("thunder退室");
        console.log(dailyThunder.lefters);
        console.log("thunder入室");
        console.log(dailyThunder.enters);
        console.log("Discord退室");
        console.log(dailyDiscord.lefters);
        console.log("Discord入室");
        console.log(dailyDiscord.enters);
        console.log("Discord-役割変更");
        console.log(dailyDiscord.roleChange);
    }
}

const test= new Daily();

module.exports = {
    Monthly,
    Daily
}