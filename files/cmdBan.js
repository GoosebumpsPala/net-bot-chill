module.exports = (message, msgSplit, prefix, client, config, Discord, connection) => {

    if (msgSplit[0].toLowerCase() != prefix + "ban") return;

    let target = message.mentions.members.first();

    if (!message.member.hasPermission("BAN_MEMBERS")) {

        message.channel.send(":x: **Tu ne peux pas faire ça !**");
        return;
    }

    if (!target) {

        message.channel.send(":x: **Veuillez spécifier un membre à bannir !**");
        return;
    }

    if (target == target.bot) {

        message.channel.send(":x: **Veuillez spécifier un joueur !**");
        return;
    }

    if (target.id == message.author.id) {

        message.channel.send(":x: **Vous ne pouvez pas vous bannir vous-même !**");
        return;
    }

    message.delete().then(() => {

        let embed = new Discord.MessageEmbed()
            .setColor("#57b8e2")
            .setTitle("Cheh, tu es ban mon reuf !")
            .setDescription("Il a été banni !")
        message.channel.send(embed)

        target.ban()
    });
}