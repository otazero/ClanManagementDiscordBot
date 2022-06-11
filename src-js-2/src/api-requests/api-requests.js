const request = require('request');

class integrationApiRequest{

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

const headers = {
    "Authorization": ``
}

const api_options_2 ={
    url: "",
    method: 'GET',
    headers: headers,
    json: true,
}

discordApiRequest(api_options_2).then(body => {
    console.log(body);
    var fs = require('fs');
    fs.writeFile('result.json', JSON.stringify(body) ,function(err, result) {
        if(err) console.log('error', err);
    });
});