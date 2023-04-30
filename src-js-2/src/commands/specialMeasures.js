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
            if(interaction.member.roles.cache.some((role) => {return role.id === clanmasterRole})){
                const operationSpecialUser = OperationDatabase.specialUser(); 
                // サブコマンドの判定
                if(interaction.options.getSubcommand() === `add`){
                    const thunderIGN = interaction.options.getString(`ign`);
                    console.log(thunderIGN);
                    await interaction.reply({ content: '特例処置者の追加を行います。', ephemeral: true });
                }
                else if(interaction.options.getSubcommand() === `remove`){
                    const thunderIGN = interaction.options.getString(`ign`);
                    await interaction.reply({ content: '特例処置者の削除を行います。', ephemeral: true });
                }
                else if(interaction.options.getSubcommand() === `list`){
                    await interaction.reply({ content: '特例処置者の一覧を表示します。', ephemeral: true });
                }
            }
            else{
                await interaction.reply({ content: '管理者限定コマンドのため無効な操作です。', ephemeral: true });
            }
        }
    }
}