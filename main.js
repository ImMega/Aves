require("dotenv").config();

const { Client, Intents } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const DisTube = require("distube");
const SpotifyPlugin = require("@distube/spotify");
const { Api } = require("node-osu");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS]
});

const player = new DisTube.default(client, {
    searchSongs: 1,
    leaveOnEmpty: true,
    emptyCooldown: 600000,
    leaveOnFinish: false,
    leaveOnStop: false,
    plugins: [new SpotifyPlugin.default()]
});

const osu = new Api(process.env.OSU_API_KEY, {
    notFoundAsError: false,
    completeScores: true,
    parseNumeric: false
});

client.prefix = "."

module.exports = {client, player, osu}

const handlers = fs.readdirSync("./Handlers/").filter(file => file.endsWith(".js"));

for(const file of handlers){
    require(`./Handlers/${file}`)(client, player);
}

mongoose.connect(process.env.MONGO_SRV)
.then(() => console.log("Connected to database!"))
.catch((err) => console.log(err));

client.login(process.env.TOKEN);