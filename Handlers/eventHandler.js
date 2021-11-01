const fs = require("fs");

module.exports = (client, player) => {
    const loadir = (dirs) => {
        const eventFiles = fs.readdirSync(`./Events/${dirs}`).filter(file => file.endsWith(".js"));

        for(const file of eventFiles){
            const event = require(`../Events/${dirs}/${file}`);
            const eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
        }
        console.log(`Discord ${dirs} events loaded`);
    }

    ["Client", "Guild", "Message"].forEach(e => loadir(e));

    const playerEvents = fs.readdirSync(`./Events/Player`).filter(file => file.endsWith(".js"));

    for(file of playerEvents){
        const event = require(`../Events/Player/${file}`);
        const eventName = file.split(".")[0];
        player.on(eventName, event.bind(null));
    }
    console.log("Player events loaded");
}