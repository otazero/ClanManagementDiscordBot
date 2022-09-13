
const clanmaster = "491578007392092170";

module.exports = {
    data: {
        name: "kickmem",
        description: "非アクティブプレイヤーを検出します。",
    },
    async execute(interaction) {
        if (interaction.commandName === 'kickmem') {
            if(interaction.member.roles.cache.some((role) => {return role.id === clanmaster})){
                
            }
            else{
                await interaction.reply({ content: '管理者限定コマンドのため無効な操作です。', ephemeral: true });
            }
        }
    }
}