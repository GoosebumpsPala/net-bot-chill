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
        .then((member) => {

            member.forEach(member => {
                connection.query("SELECT * FROM Users WHERE ID=?", [member.user.id], (error, result) => { // On regarde si il est dans la bdd

                if (error) {
        
                    console.log("Erreur MySQL - index.js - 110");
                    return;
                }
        
                if (result.length < 1) {// Si il n'est pas dans la bdd (première fois sur le serveur)
                    connection.query("INSERT INTO Users (ID, Tag, Date) VALUES (?, ?, ?)", [member.user.id, member.user.tag, Date.now()], (error, result1) => { // Alors on rajoute le prefix par défaut
            
                        if (error) {
        
                            console.log("Erreur MySQL - index.js - 119 !");
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

const jointocreatemap = new Map();
//voice state update event to check joining/leaving channels
client.on("voiceStateUpdate", (oldState, newState) => {
    // SET CHANNEL NAME STRING
    //IGNORE BUT DONT DELETE!
    let oldparentname = "unknown"
    let oldchannelname = "unknown"
    let oldchanelid = "942397107376111636"
    if (oldState && oldState.channel && oldState.channel.parent && oldState.channel.parent.name) oldparentname = oldState.channel.parent.name
    if (oldState && oldState.channel && oldState.channel.name) oldchannelname = oldState.channel.name
    if (oldState && oldState.channelID) oldchanelid = oldState.channelID
    let newparentname = "unknown"
    let newchannelname = "unknown"
    let newchanelid = "unknown"
    if (newState && newState.channel && newState.channel.parent && newState.channel.parent.name) newparentname = newState.channel.parent.name
    if (newState && newState.channel && newState.channel.name) newchannelname = newState.channel.name
    if (newState && newState.channelID) newchanelid = newState.channelID
    if (oldState.channelID) {
        if (typeof oldState.channel.parent !== "undefined")  oldChannelName = `${oldparentname}\n\t**${oldchannelname}**\n*${oldchanelid}*`
         else  oldChannelName = `-\n\t**${oldparentname}**\n*${oldchanelid}*`
    }
    if (newState.channelID) {
        if (typeof newState.channel.parent !== "undefined") newChannelName = `${newparentname}\n\t**${newchannelname}**\n*${newchanelid}*`
        else newChannelName = `-\n\t**${newchannelname}**\n*${newchanelid}*`
    }
    // JOINED V12
    if (!oldState.channelID && newState.channelID) {
      if(newState.channelID !== config.JOINTOCREATECHANNEL) return;  //if its not the jointocreatechannel skip
      jointocreatechannel(newState);   //load the function
    }
    // LEFT V12
    if (oldState.channelID && !newState.channelID) {
              //get the jointocreatechannel id from the map
            if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {
              //fetch it from the guild
              var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));
              //if the channel size is below one
              if (vc.members.size < 1) { 
                //delete it from the map
                jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`); 
                //log that it is deleted
                console.log(" :: " + oldState.member.user.username + "#" + oldState.member.user.discriminator + " :: Room wurde gelöscht")
                //delete the voice channel
                return vc.delete(); 
            }
              else {
              }
            }
    }
    // Switch v12
    if (oldState.channelID && newState.channelID) {
    
      if (oldState.channelID !== newState.channelID) {
        //if its the join to create channel
        if(newState.channelID===config.JOINTOCREATECHANNEL) 
        //make a new channel
        jointocreatechannel(oldState);  
        //BUT if its also a channel ín the map (temp voice channel)
        if (jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`)) {
          //fetch the channel
          var vc = oldState.guild.channels.cache.get(jointocreatemap.get(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`));
          //if the size is under 1
          if (vc.members.size < 1) { 
            //delete it from the map
            jointocreatemap.delete(`tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`); 
           //log it 
            console.log(" :: " + oldState.member.user.username + "#" + oldState.member.user.discriminator + " :: Room wurde gelöscht")
          //delete the room
            return vc.delete(); 
        }
        else {
        }
        }
      }
  }
    })
      async function jointocreatechannel(user) {
        //log it 
        console.log(" :: " + user.member.user.username + "#" + user.member.user.discriminator + " :: a créé un salon privé.")
        //user.member.user.send("This can be used to message the member that a new room was created")
        await user.guild.channels.create(`Salon de ${user.member.user.username}`, {
          type: 'voice',
          parent: user.channel.parent.id, //or set it as a category id
        }).then(async vc => {
          //move user to the new channel
          user.setChannel(vc);
          //set the new channel to the map
          jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
          //change the permissions of the channel
          await vc.overwritePermissions([
            {
              id: user.id,
              allow: ['MANAGE_CHANNELS'],
            },
            {
              id: user.guild.id,
              allow: ['VIEW_CHANNEL'],
            },
          ]);
        })
      }