const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "apexunbind",
    aliases: [],
    description: "Unbinds an Apex account if binded",
    usage: "apexunbind",
    async execute(message, args){
        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id
        }, {
            apexName: "noAccLinked",
            apexPlatform: "noAccLinked"
        });
        
        message.reply({ content: "Succesfully unbinded!", allowedMentions: { repliedUser: false } });
    }
}