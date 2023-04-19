const {MessageAttachment} = require("discord.js");
const {OperationDatabase} = require('../operateDatabase/opratedatabase');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Handlebars = require('handlebars');
const dataURI = require('datauri');
const roles = require('../../template/roles.json');

const env_config = require('../../config/node-html-to-image.config.json');


// プロフィール画像を作成するクラス
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
            .replace("{{body.height}}", "450px")
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
        console.log('The image was created successfully!');
        return screenshot;
    }

    /**
     * WarThunderだけのプロフィール画像
     * @returns 
     */
    async makeThunder(){
        // テンプレートを読み込む
        const browser = await puppeteer.launch();
        // ページを開く
        const page = await browser.newPage();
        // ページのサイズを指定
        await page.setViewport({width: 640, height: 350});
        // HTMLファイルを読み込み、動的な値を注入する
        // Handelebarsを使って動的な値を注入する
        const template = Handlebars.compile(fs.readFileSync(__dirname+'/html-project/public/thunder.html', 'utf8'));
        // dataを作成する必要がある。
        const htmlContent = template(this);
        // ページを読み込む
        await page.setContent(htmlContent);
        // CSSファイルを読み込む
        const unreplacedCssContent = fs.readFileSync(__dirname+'/html-project/assets/css/style.css', 'utf8');
        const cssContent = unreplacedCssContent
            .replace("{{body.height}}", "350px")
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
        console.log('The image was created successfully!');
        return screenshot;
    }
    /**
     * Wotbだけのプロフィール画像
     * @returns 
     */
    async makeWotb(){
        // テンプレートを読み込む
        const browser = await puppeteer.launch();
        // ページを開く
        const page = await browser.newPage();
        // ページのサイズを指定
        await page.setViewport({width: 640, height: 350});
        // HTMLファイルを読み込み、動的な値を注入する
        // Handelebarsを使って動的な値を注入する
        const template = Handlebars.compile(fs.readFileSync(__dirname+'/html-project/public/wotb.html', 'utf8'));
        // dataを作成する必要がある。
        const htmlContent = template(this);
        // ページを読み込む
        await page.setContent(htmlContent);
        // CSSファイルを読み込む
        const unreplacedCssContent = fs.readFileSync(__dirname+'/html-project/assets/css/style.css', 'utf8');
        const cssContent = unreplacedCssContent
            .replace("{{body.height}}", "350px")
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
        console.log('The image was created successfully!');
        return screenshot;
    }
    /**
     * Discordだけのプロフィール画像
     * @returns 
     */
    async makeDiscord(){
        // テンプレートを読み込む
        const browser = await puppeteer.launch();
        // ページを開く
        const page = await browser.newPage();
        // ページのサイズを指定
        await page.setViewport({width: 640, height: 230});
        // HTMLファイルを読み込み、動的な値を注入する
        // Handelebarsを使って動的な値を注入する
        const template = Handlebars.compile(fs.readFileSync(__dirname+'/html-project/public/discord.html', 'utf8'));
        // dataを作成する必要がある。
        const htmlContent = template(this);
        // ページを読み込む
        await page.setContent(htmlContent);
        // CSSファイルを読み込む
        const unreplacedCssContent = fs.readFileSync(__dirname+'/html-project/assets/css/style.css', 'utf8');
        const cssContent = unreplacedCssContent
            .replace("{{body.height}}", "230px")
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
        console.log('The image was created successfully!');
        return screenshot;
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