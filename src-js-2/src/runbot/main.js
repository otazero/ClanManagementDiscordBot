const {IntegrationApiRequest} = require('../api-requests/api-requests');
const {OperationDatabase} = require('../operateDatabase/opratedatabase');



/**
 * 入退室者の更新
 */
class Daily{
    wotbLefters;
    wotbEnters;
    thunderLefters;
    thunderEnters;
    discordLefters;
    discordEnters;
    roleChangers;
    test;
    constructor(){
        

    }
    async main(){
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
        console.log("\n\n\n");
        
        this.wotbLefters = dailyWotb.lefters;
        this.wotbEnters = dailyWotb.enters;
        this.thunderLefters = dailyThunder.lefters;
        this.thunderEnters = dailyThunder.enters;
        this.discordLefters = dailyDiscord.lefters;
        this.discordEnters = dailyDiscord.enters;
        this.roleChangers = dailyDiscord.roleChange;
        this.test = 1;
    }
    get wotbLeftersText(){
        let text = "";
        this.wotbLefters.forEach(user => {
            text += `・${invalidSymbol(user.ign)}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    get wotbEntersText(){
        let text = "";
        this.wotbEnters.forEach(user => {
            text += `・${invalidSymbol(user.ign)}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    get thunderLeftersText(){
        let text = "";
        this.thunderLefters.forEach(user => {
            text += `・${invalidSymbol(user.ign)}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    get thunderEntersText(){
        let text = "";
        this.thunderEnters.forEach(user => {
            text += `・${invalidSymbol(user.ign)}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    get discordLeftersText(){
        let text = "";
        this.discordLefters.forEach(user => {
            text += `・${invalidSymbol(user.ign)}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    get discordEntersText(){
        let text = "";
        this.discordEnters.forEach(user => {
            text += `・${invalidSymbol(user.ign)}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    get roleChangeText(){
        let text = "";
        this.roleChangers.forEach(user => {
            text += `・${invalidSymbol(user.user.ign)}\t${user.change}\n`; 
        });
        return text.length?text:"該当者なし";
    }
    

    
}

/**
 * 非アクティブ且つDIscord未参加抽出 総アクティブに加算+アクティブテーブルにinsert
 */

/**
 * アクテビティの更新
 */
class Monthly{
    constructor(){
        
    }
    async main(){
        const [discordusers, thunderusers] = await Promise.all([IntegrationApiRequest.requestDiscord(), IntegrationApiRequest.requestThunder()]);
        this.kickMem = await OperationDatabase.Monthly(thunderusers, discordusers);
    }
    async kickMember(){
        const [discordusers, thunderusers] = await Promise.all([IntegrationApiRequest.requestDiscord(), IntegrationApiRequest.requestThunder()]);
        this.kickMem = await OperationDatabase.LetLeftUser(thunderusers, discordusers);
    }
    get kickMemText(){
        let text = "";
        this.kickMem.forEach((user)=>{
            text += `> ・${invalidSymbol(user.ign)}\n`;
        });
        return text.length?text:"該当者なし";
    }
}

/**
 * 記号を無効化する関数
 * @param {*} text 
 * @returns 
 */
function invalidSymbol(text){
    const newtext = (text =>{
        let neww = "";
        for(let s of text){
            if(s === "_" || s === "*" || s === "~"){
                neww += "\\";
            }
            neww += s;
        }
        return neww;
    })(text);
    return newtext;
}

module.exports = {
    Monthly,
    Daily
}