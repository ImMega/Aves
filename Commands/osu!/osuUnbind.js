const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "osuunbind",
    aliases: [],
    description: "Unbinds an osu! account if binded",
    usage: "osuunbind",
    async execute(message, args){
        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            osuID: "noAccLinked"
        });
        return message.reply({ content: "Successfully unbinded!", allowedMentions: { repliedUser: false } });
    }
}