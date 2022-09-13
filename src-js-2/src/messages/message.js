const fixedTermReport = (async(MessageEmbed, client, daily, ch)=>{
    const embed = new MessageEmbed()
                    .setTitle('定時報告')
                    .setDescription('本日も一日お疲れさまでした！定時報告です！')
                    .addFields(
                        {   
                            name:`🌸ご入隊ありがとうございます🌸`, 
                            value:`本日${daily.wotbEnters.length+daily.thunderEnters.length+daily.discordEnters.length}名の方が当クランに参加してくださいました！\nよろしくね～♪`
                        }, 
                        {
                            name:'<:WT:747482544714547231>WarThunder部門', 
                            value:`${daily.thunderEntersText}`,
                            inline:true
                        }, 
                        {
                            name:'<:Blitz:755234073957367938>World of Tanks Blitz部門', 
                            value:`${daily.wotbEntersText}`, 
                            inline:true
                        },
                        {
                            name:'<:discord:1016346034760327218>クランサーバー部門', 
                            value:`${daily.discordEntersText}`, 
                            inline:true
                        },
                        {   
                            name:`🎉お疲れさまでした🎉`, 
                            value:`本日${daily.wotbLefters.length+daily.thunderLefters.length+daily.discordLefters.length}名の方が脱退しました。\n今までありがとうございました。`
                        }, 
                        {
                            name:'<:WT:747482544714547231>WarThunder部門', 
                            value:`${daily.thunderLeftersText}`,
                            inline:true
                        }, 
                        {
                            name:'<:Blitz:755234073957367938>World of Tanks Blitz部門', 
                            value:`${daily.wotbLeftersText}`, 
                            inline:true
                        },
                        {
                            name:'<:discord:1016346034760327218>クランサーバー部門', 
                            value:`${daily.discordLeftersText}`, 
                            inline:true
                        },)
                    .setColor('#800080')
                    .setTimestamp();

        client.channels.cache.get(ch).send({ embeds: [embed] });
});

const kickCall = (async(MessageEmbed, client, text, ch, thunderRole, config)=>{
    console.log("通過3");
    const embed = new MessageEmbed()
                    .setTitle('__**:cherry_blossom:非アクティブメンバー粛清大会:cherry_blossom:**__')
                    .setDescription('**非アクティブ且つDiscordクラン鯖未参加プレイヤー**を部隊よりキックします。\n候補者は下記の通りです。不具合により誤検出される場合があります。\n該当者は至急連絡されたし。')
                    .addFields(
                        {   
                            name:`粛正対象者一覧`, 
                            value:`${text}\n※非アクティブプレイヤー\n\tWarThunder部門入隊後${config.KickMember.progress}日が経過し直近30日のアクティビティが${config.KickMember.minactivity}以下の者`
                        })
                    .setColor('#00ff00')
                    .setTimestamp();

    client.channels.cache.get(ch).send({content: `<@&${thunderRole}>`, embeds: [embed] });
});

module.exports = {
    fixedTermReport,
    kickCall
}