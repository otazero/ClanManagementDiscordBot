const {kickCall} = require(`../messages/message.js`);
const {Monthly} = require(`../runbot/main.js`);
const {MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent} = require('discord.js');

const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

const discordServerInfoData = require('../../template/discordServerInfo.json');

/* ロールID */
const clanMemberRole = discordServerInfoData.roles.clanMemberRole;
const genroMemberRole = discordServerInfoData.roles.genroMemberRole;
const botRole = discordServerInfoData.roles.botRole;
const thunderRole = discordServerInfoData.roles.thunderRole;
const clanmasterRole = discordServerInfoData.roles.clanmasterRole;

/* チャンネルID */
const clanNewsCh = discordServerInfoData.channels.clanNewsCh;
const changeRoleCallCh = discordServerInfoData.channels.changeRoleCallCh;
const testDropCh = discordServerInfoData.channels.testDropCh;
const callCenterCh = discordServerInfoData.channels.callCenterCh;



module.exports = {
    data: {
        name: "kickmem",
        description: "非アクティブプレイヤーを検出します。",
    },
    async execute_commands(interaction, client) {
        if (interaction.commandName === 'kickmem') {
            if(interaction.member.roles.cache.some((role) => {return role.id === clanmasterRole})){
                const mom = new Monthly();
                await mom.kickMember();
                const tic1 = new MessageButton()
                    .setCustomId("kick-ok") //buttonにIDを割り当てる   *必須
                    .setStyle("PRIMARY")	//buttonのstyleを設定する  *必須
                    .setLabel("はい")
                const tic2 = new MessageButton()
                    .setCustomId("kick-update") //buttonにIDを割り当てる   *必須
                    .setStyle("SUCCESS")	//buttonのstyleを設定する  *必須
                    .setLabel("変更")
                const tic3 = new MessageButton()
                    .setCustomId("kick-cancel") //buttonにIDを割り当てる   *必須
                    .setStyle("DANGER")	//buttonのstyleを設定する  *必須
                    .setLabel("キャンセル")
                await interaction.reply({ content: `以下のメンバーで宜しいですか？\n${mom.kickMemText}`, ephemeral: true, components: [new MessageActionRow().addComponents([tic1, tic2, tic3])] });
            }
            else{
                await interaction.reply({ content: '管理者限定コマンドのため無効な操作です。', ephemeral: true });
            }
        }
    },
    async execute_messageComponents(interaction, client) {
        if (interaction.message.interaction.commandName === 'kickmem') {
            if (interaction.customId === "kick-ok") {
                await kickCall(MessageEmbed, client, interaction.message.content.slice(16), callCenterCh, thunderRole, config);
                interaction.update({
                    content: "告知投下しました！",
                    components: []
                });
            }
            else if(interaction.customId === "kick-update"){
                const tic1 = new MessageButton()
                        .setCustomId("kick-update-ok") //buttonにIDを割り当てる   *必須
                        .setStyle("PRIMARY")	//buttonのstyleを設定する  *必須
                        .setLabel("準備完了!")
                interaction.update({
                    content: `候補者をクリップボードにコピーしてください。\n${interaction.message.content.slice(16)}`,
                    components: [new MessageActionRow().addComponents([tic1])]
                });
            }
            else if(interaction.customId === "kick-update-ok"){
                const modal = new Modal()
                    .setCustomId('kick-update-form')
                    .setTitle('キックメンバーの編集');
                // Add components to modal
                // Create the text input components
                const hobbiesInput = new TextInputComponent()
                    .setCustomId('kick-update-member')
                    .setLabel("キックメンバーを編集してください")
                    .setPlaceholder("> ・name1\n> ・name2")
                    // Paragraph means multiple lines of text.
                    .setStyle('PARAGRAPH');
                // An action row only holds one text input,
                // so you need one action row per text input.
                const secondActionRow = new MessageActionRow().addComponents(hobbiesInput);
                // Add inputs to the modal
                modal.addComponents(secondActionRow);
                // Show the modal to the user
                await interaction.showModal(modal);
            }
            else if(interaction.customId === "kick-cancel"){
                interaction.update({
                    content: "キャンセルしました！",
                    components: []
                });
            }
        }
    },
    async execute_modals(interaction, client) {
        if (interaction.message.interaction.commandName === 'kickmem') {
            if(interaction.customId === "kick-update-form"){
                const tic1 = new MessageButton()
                        .setCustomId("kick-ok") //buttonにIDを割り当てる   *必須
                        .setStyle("PRIMARY")	//buttonのstyleを設定する  *必須
                        .setLabel("はい")
                const tic2 = new MessageButton()
                        .setCustomId("kick-update-ok") //buttonにIDを割り当てる   *必須
                        .setStyle("SUCCESS")	//buttonのstyleを設定する  *必須
                        .setLabel("変更")
                const tic3 = new MessageButton()
                        .setCustomId("kick-cancel") //buttonにIDを割り当てる   *必須
                        .setStyle("DANGER")	//buttonのstyleを設定する  *必須
                        .setLabel("キャンセル")
                interaction.update({
                    content: `以下のメンバーで宜しいですか？\n${interaction.fields.getTextInputValue('kick-update-member')}`,
                    components: [new MessageActionRow().addComponents([tic1, tic2, tic3])]
                });
            }  
        }
    }
}