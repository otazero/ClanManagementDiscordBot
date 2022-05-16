// @Index.js
/* NGワード検出 */
if(message.channel.parentId == '558946199760142337'){
for(word of ngWords){
    if(message.content.includes(word)){
    // const msg = `暴力的な言葉を検出しました:${word}\nはいBAN`;
    message.member.roles.add('968726766208299068').then(
        () => {
        message.guild.channels.create('名誉取り消し申請所', { 
            parent: "968729716607565875",
            permissionOverwrites: [
            {
                id: message.author.id,
                allow: [
                Permissions.FLAGS.VIEW_CHANNEL, 
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS
                ],
            },
            {
                id: '428086533086642179',
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: '965547497307140106',
                allow: [
                Permissions.FLAGS.MANAGE_CHANNELS,
                Permissions.FLAGS.VIEW_CHANNEL, 
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.ADD_REACTIONS
                ]
            }
            ]
        }).then(channel => {
            
            const embed = new MessageEmbed()
            .setAuthor({ name:message.author.username, iconURL:message.author.displayAvatarURL({ dynamic: true,format: 'png' })})
            .setTitle('🎖名誉惑星民予備軍を取得しました🎖')
            .setDescription(`Reason:汚い言葉(検出:${word})`)
            .addField('称号を取り消すには？', 'このチャンネルで推しについて叫んで下さい。\nいない場合は、直近で使用したネタ・おかずでも投稿してください。')
            .setColor('#93FFAB')
            .setTimestamp();
            
            channel.send({content: `<@${message.author.id}>\n<@&968726766208299068>を取得しました\n\n自称マナークランを維持するため, カテゴリ「大殿町」では暴力的な発言は禁止されています`, embeds: [embed]});
        });
        }
    );
    
    return;
    }
}
};