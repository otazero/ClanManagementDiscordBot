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
    async execute(interaction) {
        if (interaction.commandName === 'info') {
            await interaction.reply(`infoコマンド実行`);
        }
    }
}