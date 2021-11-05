const profileModel = require("../../Models/profileSchema");
const osuH = require("../../Helpers/osuHelper");

module.exports = {
    name: "setmode",
    aliases: [],
    description: "Sets the default osu! game mode",
    usage: "setmode <mode>",
    async execute(message, args, profileData){
        if(!args[0]) return message.channel.send(`You need to enter osu! mode you want to set as your default osu! mode`);

        let mode = "-" + args.shift().toLowerCase();
        let modeName;

        mode = await osuH.findMode(mode);

        if(mode === false) return message.reply({ content: "You need to enter a real osu! game mode", allowedMentions: { repliedUser: false } });

        switch(mode){
            case 0:
                modeName = "osu!standard"
                break
            case 1:
                modeName = "osu!taiko"
                break
            case 2:
                modeName = "osu!catch"
                break
            case 3:
                modeName = "osu!mania"
                break
        }

        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id
        }, {
            osuMode: mode
        }).then(() => {
            message.channel.send(`Successfully changed your default osu! game mode to **${modeName}**`);
        })
    }
}