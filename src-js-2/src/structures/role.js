const { defaults } = require("request");
const {WhatYourRole}= require('../what-your-Info/whatYourInfo');

/**
 * メインロール1個とサブロール複数を所持するクラス
 */
class roles {
    constructor(rolelist){
        const rolelists = new WhatYourRole(rolelist);
        this.main = null;
        this.sub = [];
        rolelists.forEach(element => {
            switch(element.type){
                case "main":
                    this.main = new role(element);
                    break;
                case "sub":
                    this.sub.push(new role(element));
                    break;
                default:
                    break;
            }
        });
    }
}

class role{
    constructor(roleinfo){
        this.id = roleinfo.id;
        this.name = roleinfo.name;
        this.discordid = roleinfo.discordid;
        this.type = roleinfo.type;
    }
}


module.exports = {
    roles,
    role
}