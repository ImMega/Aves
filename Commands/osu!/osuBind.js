const { osu } = require("../../main");
const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "osubind",
    aliases: [],
    description: "Binds an osu! account",
    usage: "osubind",
    async execute(message, args){
        const username = args.join(" ");
        osu.getUser({ u: username }).then(async (user) => {
            if(user.length === 0) return message.reply({ content: `**${username}** not found`, allowedMentions: { repliedUser: false } });

            const profileBindedSelf = await profileModel.findOne({
                userID: message.author.id,
                osuID: user.id
            });

            if(profileBindedSelf) return message.reply({ content: `**${user.name}** is already binded to your account!`, allowedMentions: { repliedUser: false } });

            const profileBinded = await profileModel.findOne({ osuID: user.id });

            if(profileBinded) return message.reply({ content: `**${user.name}** is already binded to an account!`, allowedMentions: { repliedUser: false } });

            const response = await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                osuID: user.id
            });

            return message.reply({ content: `Succesfully binded to **${user.name}** with ID **${user.id}**!`, allowedMentions: { repliedUser: false } });
        })
    }
}