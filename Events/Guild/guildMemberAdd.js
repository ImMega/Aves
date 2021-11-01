const profileModel = require("../../Models/profileSchema");

module.exports = async (client, member) => {
    let profile;
    try {
        profile = await profileModel.findOne({ userID: member.id });
        
        if(!profile){
            let profile = await profileModel.create({
                userID: member.id,
                serverID: member.guild.id,
                apexName: `noAccLinked`,
                apexPlatform: `noAccLinked`
            });
            profile.save();
        }
    } catch(err){
        console.log(err);
    }

    if(member.guild.id !== "902672865818705920") return;

    const ogRole = await member.guild.roles.cache.find(role => role.id === "902673373858000947");

    if(profile.serverID !== "874725401669296158") return;
    await member.roles.add(ogRole);
}