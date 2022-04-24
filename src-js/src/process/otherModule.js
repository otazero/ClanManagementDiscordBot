/* Discordの名前からIGNを推測 */
function ignMaker(userName, nickName){
    // ニックネームとユーザーネームどちらに記載してるか
    if(!nickName){
        return pickupPlayerName(userName);
    }
    else{
        return pickupPlayerName(nickName);
    }
}
/* IGNからgameIDを求める */
async function doubleIdFromIgnSelecter(playerName, roles, dbcon){
    let wotbid = null;
    let wtid = null; 
    // WTロールがあれば
    if(roles.includes('746933519518924910')){
        const [resultWtID, field] = await dbcon.query(`SELECT t_user_id FROM t_wt_members WHERE t_ign = '${playerName}' LIMIT 1`);
        if(resultWtID.length){
            wtid = resultWtID[0].t_user_id;
        }
    }
    // wotbロールがあれば
    if(roles.includes('755088093702258819')){
        const [resultWotbID, field] = await dbcon.query(`SELECT w_user_id FROM w_wotb_members WHERE w_ign = '${playerName}' LIMIT 1`);
        if(resultWotbID.length){
            wotbid = resultWotbID[0].w_user_id;
        }
    }
    return [wotbid, wtid];
}

function pickupPlayerName(name){
    // 「かっこ」があるか
    const opk = name.lastIndexOf('(');
    const clk = name.lastIndexOf(')');
    if(opk!==-1&&clk!==-1){
        return name.substring(opk+1,clk);
    }
    else{
        return name;
    }
}
module.exports = {
    ignMaker,
    doubleIdFromIgnSelecter
};