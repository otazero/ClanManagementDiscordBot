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

module.exports = {
    WhatYourIgn
}