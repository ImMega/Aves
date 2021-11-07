const profileModel = require("../../Models/profileSchema");

module.exports = async (client, message) => {
    if(!message.content.startsWith(client.prefix) || message.author.bot) return;

    const args = message.content.slice(client.prefix.length).split(/ +/);
    const command = args.shift();

    const cmd = client.commands.get(command) || client.commands.get(client.cmdA.get(command));

    let profile;
    try {
        profile = await profileModel.findOne({ userID: message.author.id });

        if(!profile){
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                apexName: `noAccLinked`,
                apexPlatform: `noAccLinked`,
                osuID: `noAccLinked`,
                osuMode: 0,
                crTag: `noAccLinked`
            });
            profile.save();
        }
    } catch(err){
        console.log(err);
    }

    if(cmd) cmd.execute(message, args, profile);
}