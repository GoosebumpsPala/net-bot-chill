module.exports = (member, client, config, Discord, connection) => {

    connection.query("SELECT * FROM Users WHERE ID=?", [member.id], (error, result) => { // On regarde si il y a un prefix

        if (error) {

            console.log("Erreur MySQL - saveUser.js - 3");
            return;
        }

        if (result.length < 1) {// Si il n'est pas dans la bdd (première fois sur le serveur)
            connection.query("INSERT INTO Users (ID, Tag, Date) VALUES (?, ?, ?)", [member.id, member.tag, Date.now()], (error, result1) => { // Alors on rajoute le prefix par défaut
    
                if (error) {

                    console.log("Erreur MySQL - saveUser.js - 11 !");
                    return;
                }
            });
            console.log("Le joueur " + member.tag + " a été rajouté à la base de donnée.")
        } else { // Si il est dans la base de donnée
            return;
        }
    });
    
}