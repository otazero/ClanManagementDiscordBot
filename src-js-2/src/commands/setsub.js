module.exports = {
    data: {
        name: "setsub",
        description: "サブ垢を設定します。",
        options: [
            {
                type: "USER",
                name: "subaccount",
                description: "サーバーに所属する本垢を選択してください。",
                required: true,
            }
        ]
    },
    async execute_commands(interaction, client) {
        if (interaction.commandName === 'setsub') {
            await interaction.reply(`サブ垢コマンド実行`);
        }
    }
}