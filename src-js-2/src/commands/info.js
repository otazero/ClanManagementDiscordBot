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

        const discord = {
            avater: interaction.user.displayAvatarURL(),
            id: result.d_user_id,
            name: result.d_name,
            ign: result.d_ign,
            role: this.#whatRole(result.d_r_id),
            enter_year: result.d_enter_at ? result.d_enter_at.getFullYear() : null,
            enter_month: result.d_enter_at ? result.d_enter_at.getMonth()+1 : null,
            enter_day: result.d_enter_at ? result.d_enter_at.getDate() : null
        };

        const thunder = {
            ign: result.t_ign,
            role: this.#whatRole(result.t_r_id),
            enter_year: result.t_enter_at ? result.t_enter_at.getFullYear() : null,
            enter_month: result.t_enter_at ? result.t_enter_at.getMonth()+1 : null,
            enter_day: result.t_enter_at ? result.t_enter_at.getDate() : null
        };

        const wotb = {
            ign: result.w_ign,
            role: this.#whatRole(result.w_r_id),
            enter_year: result.w_enter_at ? result.w_enter_at.getFullYear() : null,
            enter_month: result.w_enter_at ? result.w_enter_at.getMonth()+1 : null,
            enter_day: result.w_enter_at ? result.w_enter_at.getDate() : null
        };

        const date = new Date();
        this.data = {
            env_config,
            discord,
            thunder,
            wotb,
            date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
    }

    // dataURIを作成し、クラスメソッドに代入する
    async init() {
        this.data.pic = {
            dataURI_background : await dataURI('./images/space01.png'),
            thunderLogo : await dataURI('./images/WarThunder.png'),
            wotbLogo : await dataURI('./images/wotb.png')
        }
    }

    async #createProfile({ htmlFile, type, height }) {
        // ブラウザを起動する
        const browser = await puppeteer.launch(env_config);
        // ページを作成する
        const page = await browser.newPage();
        // ページのサイズを設定する
        await page.setViewport({ width: 640, height: height });
        // テンプレートを読み込む
        const template = Handlebars.compile(fs.readFileSync(__dirname + `/html-project/public/${htmlFile}.html`, 'utf8'));
        const htmlContent = template(this.data);
        // ページにテンプレートをセットする
        await page.setContent(htmlContent);
        // CSSを読み込む
        const unreplacedCssContent = fs.readFileSync(__dirname+'/html-project/assets/css/style.css', 'utf8');
        const cssContent = unreplacedCssContent
            .replace("{{body.height}}", `${height}px`)
            .replace("{{backgroundImg}}", this.data.pic.dataURI_background)
            .replace("{{discord_role.color}}", this.data.discord.role.color);
        await page.addStyleTag({ content: cssContent });
        // 画像を作成する
        const screenshot = await page.screenshot({
            type: 'png',
            encoding: 'binary',
            omitBackground: true
        });
        //ローカルに保存する場合
        //await page.screenshot({ path: `example_${htmlFile}.png`, omitBackground: true });
        await browser.close();
        console.log('The image was created successfully!');
        return screenshot;
    }


    /**
     * フルプロフィール画像を作成する
     * @returns
     */
    async makeFull(){
        return await this.#createProfile({htmlFile:"full", type:"png", height: 450});
    }

    /**
     * WarThunderだけのプロフィール画像
     * @returns 
     */
    async makeThunder(){
        return await this.#createProfile({htmlFile:"thunder", type:"png", height: 350});
    }
    /**
     * Wotbだけのプロフィール画像
     * @returns 
     */
    async makeWotb(){
        return await this.#createProfile({htmlFile:"wotb", type:"png", height: 350});
    }
    /**
     * Discordだけのプロフィール画像
     * @returns 
     */
    async makeDiscord(){
        return await this.#createProfile({htmlFile:"discord", type:"png", height: 230});
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