const profileModel = require("../../Models/profileSchema");
const Apex = require("apex-api");
const MozambiqueAPI = require("mozambique-api-wrapper");

const apex = new Apex(process.env.APEXTRACKER);
const mozambique = new MozambiqueAPI(process.env.MOZAMBIQUE_API_KEY);

const pc = ["pc"];
const psn = ["ps4", "ps5", "psn", "ps", "playstation"];
const xbl = ["xbox", "xbl", "x1", "xboxone", "seriesx", "xsx"];

module.exports = {
    name: "apexbind",
    aliases: [],
    async execute(message, args){
        if(!args[0] || !args[1]) return message.reply({ content: "You need to provide both username and platform", allowedMentions: { repliedUser: false } });

        const platform = args[0].toLowerCase();
        const username = args.splice(1).join(" ");

        let profile;
        if(pc.includes(platform)) profile = await this.profileFind(username, "PC");
        if(xbl.includes(platform)) profile = await this.profileFind(username, "XBOX");
        if(psn.includes(platform)) profile = await this.profileFindPS(username);

        if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });
        if(profile.apiError) return message.channel.send("An unknown error happened while searching for an Apex account");

        this.bind(message, profile.username, profile.platform);
    }, 

    async profileFind(username, platform){
        return apex.user(username, platform)
        .then((profile) => {
            if(profile.errors) return { err: "Couldn't find your account" };
    
            const playerUser = profile.data.metadata.platformUserHandle;

            return { username: playerUser, platform: platform };
        })
        .catch((err) => {
            console.log(err);
            return { apiError: err };
        })
    },

    async profileFindPS(username){
        return mozambique.search({ platform: "PS4", player: username })
        .then((profile) => {
            if(profile.errors) return { err: "Couldn't find your account" };

            const playerUser = profile.global.name;

            return { username: playerUser, platform: "PSN" };
        })
        .catch((err) => {
            console.log(err);
            return { apiError: err };
        })
    },

    async bind(message, username, platform){
        let profileBindedSelf = await profileModel.findOne({
            userID: message.author.id,
            apexName: username,
            apexPlatform: platform
        });

        if(profileBindedSelf) return message.reply({ content: `**${username}** is already binded to your account!`, allowedMentions: { repliedUser: false } });

        let profileBinded = await profileModel.findOne({
            apexName: username,
            apexPlatform: platform
        });

        if(profileBinded) return message.reply({ content: `**${username}** is already binded to an account!`, allowedMentions: { repliedUser: false } });

        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id
        }, {
            apexName: username,
            apexPlatform: platform
        });

        message.reply({ content: `Succesfully binded to **${username}** on platform **${platform}**`, allowedMentions: { repliedUser: false } });
    }
}