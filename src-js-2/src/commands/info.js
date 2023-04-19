const {MessageAttachment} = require("discord.js");
const {OperationDatabase} = require('../operateDatabase/opratedatabase');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Handlebars = require('handlebars');
const dataURI = require('datauri');
const roles = require('../../template/roles.json');

const env_config = require('../../config/node-html-to-image.config.json');

class makeProfileImg{
    constructor(result, interaction){
        this.env_config = env_config;
        this.discord_avater = interaction.user.displayAvatarURL();
        this.discord_id = result.d_user_id;
        this.discord_name = result.d_name;
        this.discord_ign = result.d_ign;
        this.discord_role = this.#whatRole(result.d_r_id);
        this.discord_enter_year = result.d_enter_at.getFullYear();
        this.discord_enter_month = result.d_enter_at.getMonth()+1;
        this.discord_enter_day = result.d_enter_at.getDate();
        
        this.thunder_ign = result.t_ign;
        this.thunder_role = this.#whatRole(result.t_r_id);
        this.thunder_enter_year = result.t_enter_at.getFullYear();
        this.thunder_enter_month = result.t_enter_at.getMonth()+1;
        this.thunder_enter_day = result.t_enter_at.getDate();

        this.wotb_ign = result.w_ign,
        this.wotb_role = this.#whatRole(result.w_r_id);
        this.wotb_enter_year = result.w_enter_at.getFullYear();
        this.wotb_enter_month = result.w_enter_at.getMonth()+1;
        this.wotb_enter_day = result.w_enter_at.getDate();

        const hiduke=new Date();             
        this.date = `${hiduke.getFullYear()}-${hiduke.getMonth()+1}-${hiduke.getDate()} ${hiduke.getHours()}:${hiduke.getMinutes()}:${hiduke.getSeconds()}`;
    }

    // dataURIを作成し、クラスメソッドに代入する
    async init() {
        this.dataURI_background = await dataURI('./images/space01.png');
        this.thunderLogo = await dataURI('./images/WarThunder.png');
        this.wotbLogo = await dataURI('./images/wotb.png');
    }

    /**
     * フルプロフィール画像を作成する
     * @returns
     */
    async makeFull(){
        // テンプレートを読み込む
        const browser = await puppeteer.launch();
        // ページを開く
        const page = await browser.newPage();
        // ページのサイズを指定
        await page.setViewport({width: 640, height: 450});
        // HTMLファイルを読み込み、動的な値を注入する
        // Handelebarsを使って動的な値を注入する
        const template = Handlebars.compile(fs.readFileSync(__dirname+'/html-project/public/full.html', 'utf8'));
        // dataを作成する必要がある。
        const htmlContent = template(this);
        // ページを読み込む
        await page.setContent(htmlContent);
        // CSSファイルを読み込む
        const unreplacedCssContent = fs.readFileSync(__dirname+'/html-project/assets/css/style.css', 'utf8');
        const cssContent = unreplacedCssContent
            .replace("{{backgroundImg}}", this.dataURI_background)
            .replace("{{discord_role.color}}", this.discord_role.color);
        // CSSをHTMLページに追加する
        await page.addStyleTag({ content: cssContent });
        // スクリーンショットを撮る
        const screenshot = await page.screenshot({
            type: 'png',
            encoding: 'binary', // バイナリー形式で取得するためにencodingを設定
            omitBackground: true
        });
        //await page.screenshot({ path: 'example.png', omitBackground: true});
        await browser.close();
        return screenshot;
    }

    /**
     * WarThunderだけのプロフィール画像
     * @returns 
     */
    async makeThunder(){
        this.env_config.TransparentPNG.html = `
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
        </html>`;
        this.env_config.TransparentPNG.content = { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb };
        const image = await nodeHtmlToImage(this.env_config.TransparentPNG);
        console.log('The image was created successfully!');
        return image;
    }
    /**
     * Wotbだけのプロフィール画像
     * @returns 
     */
    async makeWotb(){
        this.env_config.TransparentPNG.html = `
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
        </html>`;
        this.env_config.TransparentPNG.content = { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb };
        const image = await nodeHtmlToImage(this.env_config.TransparentPNG);
        console.log('The image was created successfully!');
        return image;
    }
    /**
     * Discordだけのプロフィール画像
     * @returns 
     */
    async makeDiscord(){
        this.env_config.TransparentPNG.html = `
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
        </html>`;
        this.env_config.TransparentPNG.content = { backgroundImg:dataURI_background, thunderLogo: dataURI_thunder, wotbLogo: dataURI_wotb };
        const image = await nodeHtmlToImage(this.env_config.TransparentPNG);
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
                    await createImg.init();
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
            else if(interaction.options.getSubcommand() === `activity`){
                await interaction.reply("工事中");
            }
        }
    }
}