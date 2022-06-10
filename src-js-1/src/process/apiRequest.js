const otherModule = require('./otherModule');
const request = require('request');

async function wotbApiRequest1(clanID, option){
    const wotbJson = await requestPromise(option);
    const memberDic = wotbJson['data'][`${clanID}`]['members'];
    let memberList = [];
    let i = 0;
    for(let key in memberDic){
        memberList[i] = {};
        memberList[i].id = memberDic[key]["account_id"];
        memberList[i].player = memberDic[key]["account_name"];
        memberList[i].dateOfEntry = timestampToTime(memberDic[key]["joined_at"]).replace(/\//g, '-');
        memberList[i].roleid = otherModule.wotbroleToDiscordrole(memberDic[key]["role"]);
        
        i++;
    }
    return memberList;
}

async function wotbApiRequest2(option){
    const wotbJson = await requestPromise(option);
    return wotbJson;
}

async function discordApiRequest(option){
    const discordJson = await requestPromise(option);
    return discordJson;
}

function requestPromise(param){
    return new Promise((resolve, reject)=>{
        request(param, function (error, response, body) {
            if(error){
                reject("鯖落ち説(定期)");
            }else{
                resolve(body);
            }
        });
    });
}

function timestampToTime(t){
    return new Date(t * 1000)
        .toLocaleDateString('ja', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
}





module.exports = {
    wotbApiRequest1,
    wotbApiRequest2,
    discordApiRequest
};