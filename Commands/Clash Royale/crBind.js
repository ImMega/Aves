const { cr } = require("../../main");
const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "crbind",
    aliases: [],
    description: "Binds a Clash Royale account stats",
    usage: "crbind <tag>",
    async execute(message, args){
        cr.getPlayerByTag(args[0])
        .then(async (profile) => {
            const profileBindedSelf = await profileModel.findOne({
                userID: message.author.id,
                crTag: profile.tag
            });

            if(profileBindedSelf) return message.reply({ content: `**${profile.name}** is already binded to your account!`, allowedMentions: { repliedUser: false } });

            const profileBinded = await profileModel.findOne({ crTag: profile.tag });

            if(profileBinded) return message.reply({ content: `**${profile.name}** is already binded to an account!`, allowedMentions: { repliedUser: false } });

            const response = await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                crTag: profile.tag
            });

            return message.reply({ content: `Succesfully binded to **${profile.name}** with tag **${profile.tag}**!`, allowedMentions: { repliedUser: false } });
        })
        .catch((err) => {
            console.log(err.response ? err.response : err);

            return message.reply({ content: err.response.data.message ? err.response.data.reason === "accessDenied.invalidIp" ? "Invalid authorization: IP not allowed" : err.response.data.message : "An unknown error happened while searching for Clash Royale profile", allowedMentions: { repliedUser: false } });
        })
    }
}