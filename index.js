/**
 * Netchill Bot
 * 
 * Author : Lurgubal
 */

console.log("Démarrage du bot...");

// Récupération des fichiers/librairies
const Discord = require("discord.js");
const config = require("./config.json");
const mysql = require("mysql");

// Connection à la base de donnée
const connection = mysql.createConnection({
    host: process.env.BDD_HOST,
    user: process.env.BDD_USER,
    password: process.env.BDD_PASSWORD,
    database: process.env.BDD_NAME
});
console.log("Connection à la base de donnée...");
connection.connect(error => {
    if (error) {
        console.log("Impossible de se connecter à la base de donnée !");
    } else {
        console.log("Connecté à la base de donnée !");
    }
});

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
    if (member.id === "310084517237096458") return;
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
        .setImage("https://cdn.discordapp.com/attachments/939510362817069057/941677970043572244/NOUS_TE_SOUHAITONS_LA_BIENVENUE.png");
    
    guild.channels.cache.get("939480252336463912").send(embed)
});

client.on("message", message => {
    if (!message.guild) {
        require("./files/privateTicket")(message, client, config, Discord)
    }
})

client.on("guildMemberAdd", member => {
    require("./files/saveUser")(member, client, config, Discord, connection)
})

client.on("message", message => {
    if (message.author.id !== "826357940839252008") return;
    if (!message.guild) return;
    if (message.content !== "n!saveusers") return;

    // Fetch all members from a guild
    message.guild.members.fetch()
        .then((user) => {
            connection.query("SELECT * FROM Users WHERE ID=?", [user.id], (error, result) => { // On regarde si il est dans la bdd

                if (error) {
        
                    console.log("Erreur MySQL - index.js - 110");
                    return;
                }
        
                if (result.length < 1) {// Si il n'est pas dans la bdd (première fois sur le serveur)
                    connection.query("INSERT INTO Users (ID, Tag, Date) VALUES (?, ?, ?)", [user.id, user.tag, Date.now()], (error, result1) => { // Alors on rajoute le prefix par défaut
            
                        if (error) {
        
                            console.log("Erreur MySQL - index.js - 119 !");
                            return;
                        }
                    });
                    console.log("Le joueur " + user.tag + " a été rajouté à la base de donnée.")
                    message.channel.send("Le joueur <@" + user.tag + "> a été rajouté à la base de donnée.")
                } else { // Si il est dans la base de donnée
                    message.channel.send("Le joueur <@" + user.tag + "> est déjà dans la base de donnée.")
                    return;
                }
            });
        }).catch(console.error);
})