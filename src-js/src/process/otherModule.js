function ignMaker(userName, nickName){
    // ニックネームとユーザーネームどちらに記載してるか
    if(!nickName){
        return pickupPlayerName(userName);
    }
    else{
        return pickupPlayerName(nickName);
    }
}
function ignSelect(playerName, dbcon){

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
    ignSelect
};