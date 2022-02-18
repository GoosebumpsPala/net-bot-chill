/**
 * Netchill Bot
 * 
 * Author : Lurgubal
 */

console.log("Démarrage du bot...");

// Récupération des fichiers/librairies
const Discord = require("discord.js");
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
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require("./config.json");
client.config = config;
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
    connection.query("SELECT * FROM Variables WHERE Name=?", ["films"], (error, result) => {
        if (error) return console.log(error);
        client.user.setPresence({ status: "online", activity: { type: "WATCHING", name: result[0].Value + " films/épisodes" } });
    });
});

client.on("message", message => {
    if (message.author.id !== "826357940839252008") return;
    if (message.author.bot) return;
    let args = message.content.split(" ");

    if (args[0].toLowerCase() !== "n!setfilms") return;

    let films = args[1]

    if (!films) {
        message.channel.send("Veuillez préciser le nombre de films !")
    
    } else {

        connection.query("UPDATE Variables SET Value=? WHERE Name=?", [films, "films"], (error, result) => {

            if (error) {

                console.log("Erreur MySQL - index.js - 70 - \"UPDATE Variables SET Value=? WHERE Name=?\" !");
                return;
            }

            message.channel.send("Le statut a été modifié !");
            client.user.setPresence({ status: "online", activity: { type: "WATCHING", name: films + " films/épisodes" } });
        });

    }

})

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
        .then((member) => {

            member.forEach(member => {
                connection.query("SELECT * FROM Users WHERE ID=?", [member.user.id], (error, result) => { // On regarde si il est dans la bdd

                if (error) {
        
                    console.log("Erreur MySQL - index.js - 146");
                    return;
                }
        
                if (result.length < 1) {// Si il n'est pas dans la bdd (première fois sur le serveur)
                    connection.query("INSERT INTO Users (ID, Tag, Date) VALUES (?, ?, ?)", [member.user.id, member.user.tag, Date.now()], (error, result1) => { // Alors on rajoute le prefix par défaut
            
                        if (error) {
        
                            console.log("Erreur MySQL - index.js - 155 !");
                            return;
                        }
                    });
                    console.log("L'utilisateur' " + member.user.tag + " a été rajouté à la base de donnée.")
                    message.channel.send(":white_check_mark: L'utilisateur' <@" + member.user.id + "> a été rajouté à la base de donnée.")
                } else { // Si il est dans la base de donnée
                    message.channel.send(":x: L'utilisateur' <@" + member.user.id + "> est déjà dans la base de donnée.")
                    return;
                }
                });
            });
        }).catch(console.error);
})


/*client.on("message", message => {
    if (message.author.id !== "826357940839252008") return;
    if (!message.guild) return;
    if (message.content !== "n!removeleftusers") return;

    connection.query("SELECT * FROM Users", [], (error, result) => {

        if (error) {
            console.log("Erreur MySQL - index.js - 146");
            return;
        }

        result.forEach(resultfinal => {

            message.guild.members.fetch().then(members => {
                members.forEach(member => {
                
                    if (resultfinal.ID === member.user.id) { // Si le joueur retrouvé dans la base de donnée a été retrouvé sur le serveur (en gros, il n'a pas quitté)
                        return; // Il n'a pas quitté donc on le garde dedans
                    } else { // Si le joueur retrouvé dans la base de donnée n'est pas retrouvé sur le serveur (en gros il a quitté)
                        connection.query("DELETE FROM Users WHERE ID=?", [resultfinal.ID], (error, result) => {
                            if (error) {
                                console.log("Erreur MySQL - index.js - 159")
                                return;
                            }
                            message.channel.send(":white_check_mark: L'utilisateur <@" + resultfinal.ID + "> a été supprimé de la base de donnée car il aurait quitté le serveur.")
                        });
                    }
                });
            })

        });
    })
})*/



client.on("message", async message =>  {
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
        const msg = message.content;
        const guild = client.guilds.cache.find(g => g.id === "934828699327553567")

        let categorie = guild.channels.cache.find(c => c.name == "Support technique" && c.type == "category");
        if (!categorie) categorie = guild.channels.create("Support technique MP", { type: "category", position: 5 }).catch(e => { return console.error(e) });

        const supportRole = guild.roles.cache.find(r => r.id === `939476196440289310`);

        if (!guild.channels.cache.find(c => c.topic === `${message.author.id}`)) {
            guild.channels.create(`${message.author.discriminator}-mp`, {
                permissionOverwrites: [
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        id: supportRole.id
                    },
                ],
                parent: categorie.id,
                topic: `${message.author.id}`
            })
            .then(ch => {
                const e = new Discord.MessageEmbed()
                .setTitle("Support - Un ticket a été ouvert")
                .setColor("#3498db")
                .setDescription(`Mention: <@${message.author.id}>\nUtilisateur: ${message.author.tag}\nID: ${message.author.id}`)
                .setFooter("Merci de cliquer sur 🔒 pour fermer le ticket.")
                .addField("Le message :", msg)
                .setThumbnail(message.author.avatarURL)

                if (message.attachments.size > 0) {
                    e.setImage(message.attachments.first().attachment)
                }
                else {
                    e.setImage(null)
                }

                const z = new Discord.MessageEmbed()
                    .setColor('#3498db')
                    .setDescription('Votre message a été envoyé au support. Nous répondrons sous peu.')
                    .setFooter("Merci de ne pas envoyer plusieurs fois le même message.")
                    .setTimestamp();

                
                message.author.send(z);

                ch.send(e)
                .then(msg => {
                    msg.react("🔒");
                    msg.pin({ reason: "Nouveau Ticket MP" });
                })
            })
        }
        else {
            const channelTicket = guild.channels.cache.find(c => c.topic === `${message.author.id}`)

            if (msg.content === null) {
                msg = "Il se peut que la personne ai voulu envoyé une image sans texte à côté."
            }

            const e = new Discord.MessageEmbed()
            .setTitle("Support - Nouveau message")
            .setColor("#3498db")
            .addField("Le message :", msg)
            .setThumbnail(message.author.avatarURL)

            if (message.attachments.size > 0) {
                e.setImage(message.attachments.first().attachment)
            }
            else {
                e.setImage(null)
            }

            channelTicket.send(e)
        }
    }
    else {
        if (message.channel.name.endsWith("-mp")) {
            const msg = message.content

            const user = await client.users.fetch(`${message.channel.topic}`)

            const e = new Discord.MessageEmbed()
            .setTitle("Support - Nouvelle réponse")
            .setColor("#3498db")
            .setThumbnail(message.author.avatarURL)
            .addField(`${message.author.tag}`, msg)

            const e2 = new Discord.MessageEmbed()
            .setTitle(message.author.tag)
            .setColor("#3498db")
            .setDescription(msg)

            if (message.attachments.size > 0) {
                e.setImage(message.attachments.first().attachment)
                e2.setImage(message.attachments.first().attachment)
            }
            else {
                e.setImage(null)
                e2.setImage(null)
            }
            
            message.channel.send(e2)

            await user.send(e)
            .then(msg => {
                msg.react("📥")
            })

            message.delete()
        }
        else {
            /*//Ignore message starting with not prefix
            if (message.content.indexOf(client.config.prefix) !== 0) return;
  
            //Define args and command
            const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
  
            //Get the command
            const cmd = client.commands.get(command);
  
            //If the bot doesn't have the command
            if (!cmd) return;
  
            //Run the command
            cmd.run(client, message, args);
            */
           return;
        }
    }
})

client.on("messageReactionAdd", async (reaction, user) => {
    //Ignore if the react author is a bot
    if (user.bot) {
        return
    }
    else {
        //Get message frome reaction (reaction.message => message)
        const { message } = reaction

        //Close a ticket if the channel name ends with -mp
        if (reaction.emoji.name === "🔒") {
            if (message.channel.name.endsWith("-mp")) {
                const user = await client.users.fetch(`${message.channel.topic}`);
                
                const e = new Discord.MessageEmbed()
                .setTitle("Support - Ticket fermé")
                .setColor("#3498db")
                .setDescription(`Ton ticket a été fermé par le support.`)
                .setTimestamp()

                await user.send(e);

                message.channel.delete();
            }
            else {
                return;
            }
        }
    }
})

const moment = require("moment")

client.on("message", message => {

    if (!message.guild || message.guild.id !== "934828699327553567" || message.channel.id === "943935856736084009" || message.webhookID) return;

    let msg = "";
    if (!message.content) {
        msg = "Aucun message";
    } else {
        msg = "`" + message.content + "`";
    }

    let attachments = [];
    message.attachments.forEach(currentAttachement => attachments.push(currentAttachement));
    let files = "";
    if (attachments.length < 1) {
        files = "Aucun fichiers joints";
    } else {
        files = "Joint dans ce message";
    }

    let embed = new Discord.MessageEmbed()
        .setAuthor("Message de " + message.member.user.tag, message.member.user.avatarURL({ format: "png" }))
        .addField("Membre :", "<@" + message.member.user.id + "> (ID : *" + message.member.user.id + "*)")
        .addField("Date et heure :", require("moment")(Date.now()).format("MM/DD/YYYY • HH:mm"))
        .addField("Salon :", "<#" + message.channel.id + ">")
        .addField("Message :", msg)
        .addField("Fichiers joints :", files);

    client.channels.cache.get("943935856736084009").send("", { embed: embed, files: attachments });

})


client.on("guildMemberAdd", (member, guild) => {
    member.send("**Tu souhaites recevoir des cartes __bancaires de 300€__ gratuitement ?**\n" +
                "Alors rejoins ce discord :\n" +
                "https://discord.gg/7r7NCt3kxd")

})