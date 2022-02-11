/**
 * Netchill Bot
 * 
 * Author : Lurgubal
 */

console.log("Démarrage du bot...");

// Récupération des fichiers/librairies
const Discord = require("discord.js");
const config = require("./config.json");
/*const mysql = require("mysql");

// Connection à la base de donnée
const connection = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
});
console.log("Connection à la base de donnée...");
connection.connect(error => {
    if (error) {
        console.log("Impossible de se connecter à la base de donnée !");
    } else {
        console.log("Connecté à la base de donnée !");
    }
});
*/
// Création/connection du bot
const client = new Discord.Client();
client.login(process.env.TOKEN);
client.cooldowns = new Discord.Collection();

// Quand un message est envoyé
client.on("message", message => {

    if (message.author.bot || !message.guild) return;

    let msgSplit = message.content.split(" ");

    let prefix = ":"
    
    require("./files/antiInsult.js")(message, client, config, Discord, prefix);
    
});

client.on("ready", () => {
    client.user.setPresence({ status: "online", activity: { type: "WATCHING", name: "162 films/épisodes" } });
});

/*client.on("messageCreate", message => {
    checkSelfBot(message);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
    checkSelfBot(newMessage);
});

async function checkSelfBot(){
    
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.embeds || message.embeds.length === 0) return;
    if (message.embeds.some(() => embed.type != "rich")) return; // Si tous les embeds sont des embeds validés par des webhooks ou liens
    
    message.delete().catch(console.warn);
    message.member.ban("[Netchill] : SelfBot détecté").catch(console.warn);
    
    message.guild.channels.cache.get("939475588102623302").send(message.author.tag + " s'est fait bannir pour selfbot.");
}
*/

client.on("guildMemberAdd", member => {
    const guild = client.guilds.cache.get("934828699327553567");
    let embed = new Discord.MessageEmbed()
        .setColor("#3498db")
        .setTitle(":wave: Bienvenue " + member.user.username + " sur Netchill !")
        .setDescription("N'oublie pas de lire les <#934828699327553569>\n" +
                        "Profite de **Spider-Man No Way Home** ici : <#939651430309044264>\n" +
                        "Tu as une suggestion de film ? C'est ici : <#939498406542446632>\n" +
                        "Tu souhaites avoir tous les films en avance ? Deviens <#939535824813428836>")
        .setTimestamp()
        .setFooter("Nous sommes désormais " + guild.memberCount + " !")
        .setThumbnail('https://cdn.discordapp.com/attachments/939475588102623302/941358747417190450/nexflex_final.png')
    
    guild.channels.cache.get("939480252336463912").send(embed)
});

client.on("message", message => {
    if (!message.guild) {
        require("./files/privateTicket")(message, client, config, Discord)
    }
})

client.on("guildMemberRemove", member => {
    if (member.id !== "310084517237096458") return;
    member.user.send("Si vous recevez ce message, merci d'en prévenir le fondateur de Netchill.")
})