const {OperationDatabase} = require('../operateDatabase/opratedatabase');

// クラマスロールのIDを取得
const discordServerInfoData = require('../../template/discordServerInfo.json');
const clanmasterRole = discordServerInfoData.roles.clanmasterRole;

module.exports = {
    data: {
        name: "special",
        description: "特例処置者を設定します",
        options: [
            {
                type: "SUB_COMMAND",
                name: "add",
                description: "特例処置者の追加を行います。",
                options: [
                    {
                        type: "STRING",
                        name: "ign",
                        description: "特例処置者のIGNを入力してください。",
                        required: true,
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: "remove",
                description: "特例処置者の削除を行います。",
                options: [
                    {
                        type: "STRING",
                        name: "ign",
                        description: "特例処置者のIGNを入力してください。",
                        required: true,
                    }
                ]
            },
            {
                type: "SUB_COMMAND",
                name: "list",
                description: "特例処置者の一覧を表示します。",
            }
        ],
    },
    async execute_commands(interaction, client) {
        if (interaction.commandName === 'special') {
            const operationSpecialUser = OperationDatabase.specialUser(); 
            // サブコマンドの判定
            if(interaction.options.getSubcommand() === `add`){
                if(interaction.member.roles.cache.some((role) => {return role.id === clanmasterRole})){
                    const thunderIGN = interaction.options.getString(`ign`);
                    const result = await operationSpecialUser.addSpecialUser(thunderIGN);
                    if(result.affectedRows == 1 && result.changedRows == 1){
                        await interaction.reply({ content: `**${thunderIGN}**を特例処置対象者に変更しました。`, ephemeral: true });
                    }
                    else if(result.affectedRows == 1 && result.changedRows == 0){
                        await interaction.reply({ content: `**${thunderIGN}**は既に特例処置対象者です。`, ephemeral: true });
                    }
                    else{
                        await interaction.reply({ content: `**${thunderIGN}**の追加に失敗しました。\nIGNが異なるか、データベースの更新がまだです。`, ephemeral: true });
                    }
                }
                else{
                    await interaction.reply({ content: '管理者限定コマンドのため無効な操作です。', ephemeral: true });
                }
            }
            else if(interaction.options.getSubcommand() === `remove`){
                if(interaction.member.roles.cache.some((role) => {return role.id === clanmasterRole})){
                    const thunderIGN = interaction.options.getString(`ign`);
                    const result = await operationSpecialUser.removeSpecialUser(thunderIGN);
                    if(result.affectedRows == 1 && result.changedRows == 1){
                        await interaction.reply({ content: `**${thunderIGN}**を特例処置対象者から削除しました。`, ephemeral: true });
                    }
                    else if(result.affectedRows == 1 && result.changedRows == 0){
                        await interaction.reply({ content: `**${thunderIGN}**は特例処置対象者ではありません。`, ephemeral: true });
                    }
                    else{
                        await interaction.reply({ content: `**${thunderIGN}**の削除に失敗しました。\nIGNが異なる可能性があります。`, ephemeral: true });
                    }
                }
                else{
                    await interaction.reply({ content: '管理者限定コマンドのため無効な操作です。', ephemeral: true });
                }
            }
            else if(interaction.options.getSubcommand() === `list`){
                const specialUsers = await operationSpecialUser.getSpecialUsers();
                const specialUserList = specialUsers.map(user => `・${user.ign}`).join('\n');
                const memtxt = `>>> ${specialUserList}`;
                await interaction.reply({ content: `特例処置者の一覧を表示します。\n${memtxt}`, ephemeral: false });
            }
        }
    }
}