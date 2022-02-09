/**
 * Bot Cubik Bot test Moderation
 * 
 * Author : Bears
 */

console.log("Démarrage du bot...");

// Récupération des fichiers/librairies
const Discord = require("discord.js");
const config = require("./config.json");
const mysql = require("mysql");

// Connection à la base de donnée
const connection = mysql.createConnection({
    host: "mysql-bears.alwaysdata.net",
    user: "bears",
    password: "9wBay9J7A",
    database: "bears_revo"
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
client.login("NzY1OTUyMjYxNjU0MzE1MDI4.X4cSoQ.Rgn58s_K2tLJu96F75Rnd1RAYyA");
client.cooldowns = new Discord.Collection();

// Quand un message est envoyé
client.on("message", message => {

    if (message.author.bot || !message.guild) return;

    let msgSplit = message.content.split(" ");

    let prefix = "/"

    require("./files/cmdBan")(message, msgSplit, prefix, client, config, Discord, connection);

});


client.on("message", message => {

  if (message.author.bot || !message.guild) return;

  connection.query("SELECT * FROM events WHERE ID_User=?", [message.author.id], (error, result) => {

    if (error) {

        console.log("Erreur MySQL - ligne 53 - \"SELECT * FROM inventory WHERE Member_ID=?\" !");
        return;
    }
  
    if (result.length < 1 ) {

        console.log(message.author.username + " viens de parler. Création de son fichier pour récuper ses récompenses...");
        connection.query("INSERT INTO events (ID_User, Name_User, Cubik_Coins) VALUES (?, ?, ?)", [message.author.id, message.author.username, "0"], (error, result) => {

          if (error) {

              console.log("Erreur MySQL - ligne 64.js - \"Member_ID, Coloniee\" !");
              return;
          }
          return;
      });
      return;
    }

  // coins
  let mincoins = 0;
  let maxcoins = 10;
  let coinsToAdd = Math.random() * (maxcoins - mincoins) + mincoins;
  let coinsuser = result[0].Cubik_Coins
  let userid = message.author.id

    connection.query("UPDATE events SET Cubik_Coins=" + [coinsuser + coinsToAdd] + " WHERE ID_User=[" + userid + "]", [coinsuser + coinsToAdd, userid], (error, result) => {

      if (error) {

        console.log("Erreur MySQL - msgMine.js - ligne 82 - \"UPDATE inventory SET Diamond=?, Gold=?, Iron=?, Coal=? WHERE Member_ID=?\" !");
      }

      console.log(result)
      console.error(error)

   return;
  
  });
});
})
