const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "crunbind",
    aliases: [],
    description: "Binds a Clash Royale account if binded",
    usage: "crunbind",
    async execute(message, args){
        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            crTag: "noAccLinked"
        });
        return message.reply({ content: "Successfully unbinded!", allowedMentions: { repliedUser: false } });
    }
}