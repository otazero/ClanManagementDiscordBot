/**
 * ユーザネームとニックネームからIGNを推測する
 */
class WhatYourIgn{
    /**
     * 
     * @param {string?} nickname
     * @param {string} username
     */
    static getign(username , nickname){
        if(nickname === null){
            return this.#whichRowOrMake(username);
        }
        else{
            return this.#whichRowOrMake(nickname);
        }
    }
    /**
     * 
     * @param {string} name 
     */
    static #whichRowOrMake(name){
        const length = name.length - 1;
        if(name[length] === ')'){
            return this.#kakkonai(name, length);
        }
        else{
            return name;
        }
    }
    static #kakkonai(name, length){
        const start = name.lastIndexOf('(') + 1;
        const end = length;
        const ign = name.substring(start, end);
        return ign;
    }
}
const roleData= require('../../template/roles.json');

class WhatYourRole{
    /**
     * 
     * @param {string[]} roles ロール名orロールIDの配列
     */
    constructor(roles){
        const roleinfolist = roles.map(role => {
            const templi = roleData.map(roleinfo =>{
                if(roleinfo.discordid === role){
                    return roleinfo;
                }
                else{
                    if(roleinfo.othername.some(other => other === role)){
                        return roleinfo;
                    }
                }
            }).filter(Boolean);
            return templi[0];
        }).filter(Boolean);
        return roleinfolist;
    }
}

const test = new WhatYourRole(["558947013744525313", "746933519518924910"]);

module.exports = {
    WhatYourIgn,
    WhatYourRole
}