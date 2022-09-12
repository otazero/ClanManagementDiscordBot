module.exports = {
    data: {
        name: "kickmem",
        description: "非アクティブプレイヤーを検出します。",
    },
    async execute(interaction) {
        if (interaction.commandName === 'kickmem') {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        }
    }
}