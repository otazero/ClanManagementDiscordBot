const {MessageAttachment} = require("discord.js");
const {OperationDatabase} = require('../operateDatabase/opratedatabase');
const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs');
const roles = require('../../template/roles.json');

const createURI = ((path)=>{
    const image = fs.readFileSync(path);
    const base64Image = new Buffer.from(image).toString('base64');
    return 'data:image/png;base64,' + base64Image;
});

const dataURI_background = createURI('./images/space01.png');
const dataURI_thunder = createURI('./images/WarThunder.png');
const dataURI_wotb = createURI('./images/wotb.png');

class makeProfileImg{
    constructor(result, interaction){
        this.discord_avater = interaction.user.displayAvatarURL();
        this.discord_id = result.d_user_id;
        this.discord_name = result.d_name;
        this.discord_ign = result.d_ign;
        this.discord_enter = result.d_enter_at;
        this.discord_role = this.#whatRole(result.d_r_id);
        
        this.thunder_ign = result.t_ign;
        this.thunder_role = this.#whatRole(result.t_r_id);
        this.thunder_enter = result.t_enter_at;

        this.wotb_ign = result.w_ign,
        this.wotb_role = this.#whatRole(result.w_r_id);
        this.wotb_enter = result.w_enter_at;

        const hiduke=new Date();             
        this.date = `${hiduke.getFullYear()}-${hiduke.getMonth()+1}-${hiduke.getDate()} ${hiduke.getHours()}:${hiduke.getMinutes()}:${hiduke.getSeconds()}`;
    }
    /**
     * フルプロフィール画像
     * @returns 
     */
    async makeFull(){
        const image = await nodeHtmlToImage({
            /*output: './image.png',*/
            puppeteerArgs: {executablePath: "chromium-browser", args: ["--no-sandbox", "--disable-setuid-sandbox"]},
            type: 'png',
            transparent: true,
            html: `
            <html>
                <head>
                    <style>
                        body{
                            width:640px;
                            height: 450px;
                            background-color: transparent;
                            
                        }
                        header{
                            height: 30px;
                            width: 620px;
                            padding: 10px;

                            font-size: 20px;
                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        .header-title {
                            float: left;
                        }
                        .header-option {
                            float: right;
                        }
                        div.discord{
                            width: 620px;
                            height: 120px;
                            padding: 0px 10px;
                            position: relative;
                        }
                        .ss{

                            width:640px;
                            height: 450px;
                            background: #ffffff url("{{ backgroundImg }}");
                            border-radius: 30px;
                            background-size: cover;
                        }
                        .ssa {
                            width:640px;
                            height: 450px;
                            background: rgba(255, 255, 255, 0.5);
                            border-radius: 30px;
                        }
                        div.avater{
                            float: left;
                        }
                        img.avater {
                            border-radius: 10px;
                            border: 8px solid gold;
                        }
                        div.name{
                            margin: 0px;
                            padding: 0px 0px;
                            font-size: 35px;

                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        div.discord-ign {
                            position: absolute;
                            top: 70px;
                            left: 130px;
                            font-weight: bold;
                        }
                        div.discord-join-at {
                            position: absolute;
                            top: 70;
                            right: 10;
                        }
                        div.game-info{
                            width: 640px;
                            height: 110px;
                            background: rgba(255, 255, 255, 0.5);
                        }
                        img.logo {
                            float: left;
                        }
                        
                        p.ign{
                            font-size: 30px;
                            font-weight: bold;
                            
                            color: black;
                        }
                        div.role{
                            background-color:${this.discord_role.color};
                            margin: 0px 100px;
                            width:200px;
                            color: #ffffff;
                            font-weight: bold;
                        }
                        div.join-at{
                            color: blue;
                            font-weight: bold;
                        }
                        p.option-title{
                            font-size: 15px;
                        }
                        p.option-info{
                            font-size: 20px;
                        }
                        footer {
                            width: 620px;
                            height: 30px;
                            padding: 10px;
                        }
                        div.create{
                            float: right;
                            margin-top: 10px;
                        }
                        p{
                            margin: 0px 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ss">
                        <div class="ssa">
                            <header>
                                <div class="header-title">PROFILE</div>
                                <div class="header-option">ID:${this.discord_id}</div>
                            </header>
                            <div class="discord">
                                <div class="avater">
                                    <img class="avater" src="${this.discord_avater}" alt=""  width="100" height="100">
                                </div>
                                <div class="name">${this.discord_name}</div>
                                <div class="discord-ign"><p class="option-title">Registered Player Name</p><p class="option-info">${this.discord_ign}</p></div>
                                <div class="join-at discord-join-at"><p class="option-title">Join at</p><p>${this.discord_enter.getFullYear()}-${this.discord_enter.getMonth()+1}-${this.discord_enter.getDate()}</p></div>
                            </div>
                            <div class="game-pro">
                                <div class="game-info">
                                    <img class="logo" src="{{ thunderLogo }}" alt=""  width="100" height="100">
                                    <div class="game-info-text">
                                        <p class="ign">${this.thunder_ign}</p>
                                        <div class="role"><p>${this.thunder_role.name}</p></div>
                                        <div class="join-at"><p class="option-title">Join at</p><p>${this.thunder_enter.getFullYear()}-${this.thunder_enter.getMonth()+1}-${this.thunder_enter.getDate()}</p></div>
                                    </div>
                                </div>
                                <div class="game-info">
                                    <img class="logo" src="{{ wotbLogo }}" alt="" width="100" height="100">
                                    <div class="game-info-text">
                                        <p class="ign">${this.wotb_ign}</p>
                                        <div class="role"><p>${this.wotb_role.name}</p></div>
                                        <div class="join-at"><p class="option-title">Join at</p><p>${this.wotb_enter.getFullYear()}-${this.wotb_enter.getMonth()+1}-${this.wotb_enter.getDate()}</p></div>
                                    </div>
                                </div>
                            </div>
                            <footer>
                                <div class="create">Created:${this.date}</div>
                            </footer>
                        </div>
                    </div>
                </body>
            </html>`,
            content: { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb }
        });
        console.log('The image was created successfully!');
        return image;
    }
    /**
     * WarThunderだけのプロフィール画像
     * @returns 
     */
    async makeThunder(){
        const image = await nodeHtmlToImage({
            /*output: './image.png',*/
            puppeteerArgs: {executablePath: "chromium-browser", args: ["--no-sandbox", "--disable-setuid-sandbox"]},
            type: 'png',
            transparent: true,
            html: `
            <html>
                <head>
                    <style>
                        body{
                            width:640px;
                            height: 350px;
                            background-color: transparent;
                            
                        }
                        header{
                            height: 30px;
                            width: 620px;
                            padding: 10px;

                            font-size: 20px;
                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        .header-title {
                            float: left;
                        }
                        .header-option {
                            float: right;
                        }
                        div.discord{
                            width: 620px;
                            height: 120px;
                            padding: 0px 10px;
                            position: relative;
                        }
                        .ss{

                            width:640px;
                            height: 350px;
                            background: #ffffff url("{{ backgroundImg }}");
                            border-radius: 30px;
                            background-size: cover;
                        }
                        .ssa {
                            width:640px;
                            height: 350px;
                            background: rgba(255, 255, 255, 0.5);
                            border-radius: 30px;
                        }
                        div.avater{
                            float: left;
                        }
                        img.avater {
                            border-radius: 10px;
                            border: 8px solid gold;
                        }
                        div.name{
                            margin: 0px;
                            padding: 0px 0px;
                            font-size: 35px;

                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        div.discord-ign {
                            position: absolute;
                            top: 70px;
                            left: 130px;
                            font-weight: bold;
                        }
                        div.discord-join-at {
                            position: absolute;
                            top: 70;
                            right: 10;
                        }
                        div.game-info{
                            width: 640px;
                            height: 110px;
                            background: rgba(255, 255, 255, 0.5);
                        }
                        img.logo {
                            float: left;
                        }
                        
                        p.ign{
                            font-size: 30px;
                            font-weight: bold;
                            
                            color: black;
                        }
                        div.role{
                            background-color: ${this.discord_role.color};
                            margin: 0px 100px;
                            width:200px;
                            color: #ffffff;
                            font-weight: bold;
                        }
                        div.join-at{
                            color: blue;
                            font-weight: bold;
                        }
                        p.option-title{
                            font-size: 15px;
                        }
                        p.option-info{
                            font-size: 20px;
                        }
                        footer {
                            width: 620px;
                            height: 30px;
                            padding: 10px;
                        }
                        div.create{
                            float: right;
                            margin-top: 10px;
                        }
                        p{
                            margin: 0px 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ss">
                        <div class="ssa">
                            <header>
                                <div class="header-title">PROFILE</div>
                                <div class="header-option">ID:${this.discord_id}</div>
                            </header>
                            <div class="discord">
                                <div class="avater">
                                    <img class="avater" src="${this.discord_avater}" alt=""  width="100" height="100">
                                </div>
                                <div class="name">${this.discord_name}</div>
                                <div class="discord-ign"><p class="option-title">Registered Player Name</p><p class="option-info">${this.discord_ign}</p></div>
                                <div class="join-at discord-join-at"><p class="option-title">Join at</p><p>${this.discord_enter.getFullYear()}-${this.discord_enter.getMonth()+1}-${this.discord_enter.getDate()}</p></div>
                            </div>
                            <div class="game-pro">
                                <div class="game-info">
                                    <img class="logo" src="{{ thunderLogo }}" alt=""  width="100" height="100">
                                    <div class="game-info-text">
                                        <p class="ign">${this.thunder_ign}</p>
                                        <div class="role"><p>${this.thunder_role.name}</p></div>
                                        <div class="join-at"><p class="option-title">Join at</p><p>${this.thunder_enter.getFullYear()}-${this.thunder_enter.getMonth()+1}-${this.thunder_enter.getDate()}</p></div>
                                    </div>
                                </div>
                            </div>
                            <footer>
                                <div class="create">Created:${this.date}</div>
                            </footer>
                        </div>
                    </div>
                </body>
            </html>`,
            content: { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb }
        });
        console.log('The image was created successfully!');
        return image;
    }
    /**
     * Wotbだけのプロフィール画像
     * @returns 
     */
    async makeWotb(){
        const image = await nodeHtmlToImage({
            /*output: './image.png',*/
            puppeteerArgs: {executablePath: "chromium-browser", args: ["--no-sandbox", "--disable-setuid-sandbox"]},
            type: 'png',
            transparent: true,
            html: `
            <html>
                <head>
                    <style>
                        body{
                            width:640px;
                            height: 350px;
                            background-color: transparent;
                            
                        }
                        header{
                            height: 30px;
                            width: 620px;
                            padding: 10px;

                            font-size: 20px;
                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        .header-title {
                            float: left;
                        }
                        .header-option {
                            float: right;
                        }
                        div.discord{
                            width: 620px;
                            height: 120px;
                            padding: 0px 10px;
                            position: relative;
                        }
                        .ss{

                            width:640px;
                            height: 350px;
                            background: #ffffff url("{{ backgroundImg }}");
                            border-radius: 30px;
                            background-size: cover;
                        }
                        .ssa {
                            width:640px;
                            height: 350px;
                            background: rgba(255, 255, 255, 0.5);
                            border-radius: 30px;
                        }
                        div.avater{
                            float: left;
                        }
                        img.avater {
                            border-radius: 10px;
                            border: 8px solid gold;
                        }
                        div.name{
                            margin: 0px;
                            padding: 0px 0px;
                            font-size: 35px;

                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        div.discord-ign {
                            position: absolute;
                            top: 70px;
                            left: 130px;
                            font-weight: bold;
                        }
                        div.discord-join-at {
                            position: absolute;
                            top: 70;
                            right: 10;
                        }
                        div.game-info{
                            width: 640px;
                            height: 110px;
                            background: rgba(255, 255, 255, 0.5);
                        }
                        img.logo {
                            float: left;
                        }
                        
                        p.ign{
                            font-size: 30px;
                            font-weight: bold;
                            
                            color: black;
                        }
                        div.role{
                            background-color:${this.discord_role.color};
                            margin: 0px 100px;
                            width:200px;
                            color: #ffffff;
                            font-weight: bold;
                        }
                        div.join-at{
                            color: blue;
                            font-weight: bold;
                        }
                        p.option-title{
                            font-size: 15px;
                        }
                        p.option-info{
                            font-size: 20px;
                        }
                        footer {
                            width: 620px;
                            height: 30px;
                            padding: 10px;
                        }
                        div.create{
                            float: right;
                            margin-top: 10px;
                        }
                        p{
                            margin: 0px 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ss">
                        <div class="ssa">
                            <header>
                                <div class="header-title">PROFILE</div>
                                <div class="header-option">ID:${this.discord_id}</div>
                            </header>
                            <div class="discord">
                                <div class="avater">
                                    <img class="avater" src="${this.discord_avater}" alt=""  width="100" height="100">
                                </div>
                                <div class="name">${this.discord_name}</div>
                                <div class="discord-ign"><p class="option-title">Registered Player Name</p><p class="option-info">${this.discord_ign}</p></div>
                                <div class="join-at discord-join-at"><p class="option-title">Join at</p><p>${this.discord_enter.getFullYear()}-${this.discord_enter.getMonth()+1}-${this.discord_enter.getDate()}</p></div>
                            </div>
                            <div class="game-pro">
                                <div class="game-info">
                                    <img class="logo" src="{{ wotbLogo }}" alt="" width="100" height="100">
                                    <div class="game-info-text">
                                        <p class="ign">${this.wotb_ign}</p>
                                        <div class="role"><p>${this.wotb_role.name}</p></div>
                                        <div class="join-at"><p class="option-title">Join at</p><p>${this.wotb_enter.getFullYear()}-${this.wotb_enter.getMonth()+1}-${this.wotb_enter.getDate()}</p></div>
                                    </div>
                                </div>
                            </div>
                            <footer>
                                <div class="create">Created:${this.date}</div>
                            </footer>
                        </div>
                    </div>
                </body>
            </html>`,
            content: { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb }
        });
        console.log('The image was created successfully!');
        return image;
    }
    /**
     * Discordだけのプロフィール画像
     * @returns 
     */
    async makeDiscord(){
        const image = await nodeHtmlToImage({
            /*output: './image.png',*/
            puppeteerArgs: {executablePath: "chromium-browser", args: ["--no-sandbox", "--disable-setuid-sandbox"]},
            type: 'png',
            transparent: true,
            html: `
            <html>
                <head>
                    <style>
                        body{
                            width:640px;
                            height: 230px;
                            background-color: transparent;
                            
                        }
                        header{
                            height: 30px;
                            width: 620px;
                            padding: 10px;

                            font-size: 20px;
                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        .header-title {
                            float: left;
                        }
                        .header-option {
                            float: right;
                        }
                        div.discord{
                            width: 620px;
                            height: 120px;
                            padding: 0px 10px;
                            position: relative;
                        }
                        .ss{

                            width:640px;
                            height: 230px;
                            background: #ffffff url("{{ backgroundImg }}");
                            border-radius: 30px;
                            background-size: cover;
                        }
                        .ssa {
                            width:640px;
                            height: 230px;
                            background: rgba(255, 255, 255, 0.5);
                            border-radius: 30px;
                        }
                        div.avater{
                            float: left;
                        }
                        img.avater {
                            border-radius: 10px;
                            border: 8px solid gold;
                        }
                        div.name{
                            margin: 0px;
                            padding: 0px 0px;
                            font-size: 35px;

                            color: #ffffff;
                            font-weight: bold;
                            font-family: "fantasy";
                            text-shadow: 2px 2px 2px black;
                        }
                        div.discord-ign {
                            position: absolute;
                            top: 70px;
                            left: 130px;
                            font-weight: bold;
                        }
                        div.discord-join-at {
                            position: absolute;
                            top: 70;
                            right: 10;
                        }
                        div.game-info{
                            width: 640px;
                            height: 110px;
                            background: rgba(255, 255, 255, 0.5);
                        }
                        img.logo {
                            float: left;
                        }
                        
                        p.ign{
                            font-size: 30px;
                            font-weight: bold;
                            
                            color: black;
                        }
                        div.role{
                            background-color:${this.discord_role.color};
                            margin: 0px 100px;
                            width:200px;
                            color: #ffffff;
                            font-weight: bold;
                        }
                        div.join-at{
                            color: blue;
                            font-weight: bold;
                        }
                        p.option-title{
                            font-size: 15px;
                        }
                        p.option-info{
                            font-size: 20px;
                        }
                        footer {
                            width: 620px;
                            height: 30px;
                            padding: 10px;
                        }
                        div.create{
                            float: right;
                            margin-top: 10px;
                        }
                        p{
                            margin: 0px 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="ss">
                        <div class="ssa">
                            <header>
                                <div class="header-title">PROFILE</div>
                                <div class="header-option">ID:${this.discord_id}</div>
                            </header>
                            <div class="discord">
                                <div class="avater">
                                    <img class="avater" src="${this.discord_avater}" alt=""  width="100" height="100">
                                </div>
                                <div class="name">${this.discord_name}</div>
                                <div class="discord-ign"><p class="option-title">Registered Player Name</p><p class="option-info">${this.discord_ign}</p></div>
                                <div class="join-at discord-join-at"><p class="option-title">Join at</p><p>${this.discord_enter.getFullYear()}-${this.discord_enter.getMonth()+1}-${this.discord_enter.getDate()}</p></div>
                            </div>
                            <footer>
                                <div class="create">Created:${this.date}</div>
                            </footer>
                        </div>
                    </div>
                </body>
            </html>`,
            content: { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb }
        });
        console.log('The image was created successfully!');
        return image;
    }
    /**
     * 
     * @param {*} roleid 
     * @returns {roleobj} {id, name}
     */
    #whatRole(roleid){
        if(!roleid){
            return null;
        }
        const roleobj = ((roleid)=>{
            for(let r of roles){
                if(r.id == roleid){
                    
                    return {id:roleid, name:r.name, color:r.color};
                }
            }
        })(roleid);
        return roleobj;
    }
}

module.exports = {
    data: {
        name: "info",
        description: "情報を統括するコマンドです。",
        options: [
            {
                type: "SUB_COMMAND",
                name: "profile",
                description: "Botに登録されているプロフィールを表示します。",
            },
            {
                type: "SUB_COMMAND",
                name: "activity",
                description: "Info about WarThunderのアクティビティ履歴を表示します。",
                options: [
                    {
                        type: "STRING",
                        name: "period",
                        description: "グラフに表示する期間を選択してください。(デフォルト:直近1年)",
                        choices: [
                        {
                            name: "one-year",
                            value: "oneYear"
                        },
                        {
                            name: "last-six-months",
                            value: "halfYear"
                        },
                        {
                            name: "all",
                            value: "all"
                        }
                        ],
                    }
                ]
            },
        ],
    },
    async execute_commands(interaction, client) {
        if (interaction.commandName === 'info') {
            if(interaction.options.getSubcommand() === `profile`){
                const result = await OperationDatabase.getProfile(interaction.user.id);
                if(result.length){
                    const r = result[0];
                    await interaction.deferReply();
                    const createImg = new makeProfileImg(r, interaction);
                    // Buffer型を用意したかった...
                    let imageBuffer = Buffer.from("");
                    // フル表示
                    if(r.t_ign && r.w_ign){
                        
                        imageBuffer = await createImg.makeFull();
                        
                    }
                    // Thunderのみ
                    else if(r.t_ign){
                        imageBuffer = await createImg.makeThunder();
                    }
                    // wotbのみ
                    else if(r.w_ign){
                        imageBuffer = await createImg.makeWotb();
                    }
                    // discordのみ
                    else{
                        imageBuffer = await createImg.makeDiscord();
                    }
                    const attachment = new MessageAttachment(imageBuffer, 'Profile.png');
                    await interaction.editReply({
                        files: [attachment]
                    });
                }
            }
        }
    }
}