module.exports = async (message, client, config, Discord, prefix) => {

    if (message.author.bot) return;
    
    const isInvite = (guild, code) => new Promise((resolve) => {
        guild.fetchInvites().then((invites) => {
            resolve(invites.some((value) => value[0] === code));
        });
    });
    
    const code = message.content.split("discord.gg/")[1];
    if (message.content.includes("discord.gg/")) {
            const isOurInvite = await isInvite(message.guild, code);
            if(!IsOurInvite) {
                message.delete();
                message.channel.send(":warning: **La pub n'est pas autorisée !**");
            };
        };
    
    const code = message.content.split("discord.com/invite/")[1];
    if (message.content.includes("discord.com/invite/")) {
            const isOurInvite = await isInvite(message.guild, code);
            if(!IsOurInvite) {
                message.delete();
                message.channel.send(":warning: **La pub n'est pas autorisée !**");
            };
        };

}
