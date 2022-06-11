class User {
    constructor() {
        this.id;
        this.ign;
        this.role;
        this.enter_at;
        this.left_at;
        this.isflag;
    }
}

class WotbUser extends User {
    constructor(){
        super();
    }
}

class ThunderUser extends User {
    constructor(){
        super();
        this.nowactive;
        this.allactive;
    }
}

class DiscordUser extends User {
    constructor(){
        super();
        this.username;
        this.wotbid;
        this.thunderis;
        this.nick;
        this.sub;
    }
}

let list = [1, 2, 3];
let temp = [];
for(let i of list){
    let test = new DiscordUser(i);
    temp.push(test);
}

console.log(temp);

temp.forEach(i => {
    console.log(i.username);
});