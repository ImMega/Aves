const { cr, client } = require("../../main");
const { MessageEmbed } = require("discord.js");
const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "cr",
    aliases: [],
    description: "Shows a Clash Royale account stats",
    usage: "cr [tag]",
    async execute(message, args, profileData){
        if(!args[0]){
            if(profileData.crTag === "noAccLinked") return message.reply({ content: `You need to enter a Clash Royale tag or bind your account with \`${client.prefix}crbind\``, allowedMentions: { repliedUser: false } });

            const profile = await this.profileFind(profileData.crTag);

            if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });

            const embed = await this.embedBuild(message, profile);

            message.channel.send({ embeds: [embed] });
        } else {
            const member = message.mentions.members.first();

            if(member){
                const targetProfile = await profileModel.findOne({ userID: member.id });

                if(targetProfile.crTag === "noAccLinked") return message.reply({ content: "That user doesn't have their Clash Royale account binded" });

                const profile = await this.profileFind(targetProfile.crTag);

                if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });

                const embed = await this.embedBuild(message, profile);
                
                message.channel.send({ embeds: [embed] });
            } else {
                const profile = await this.profileFind(args[0]);

                if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });

                const embed = await this.embedBuild(message, profile);

                message.channel.send({ embeds: [embed] });
            }
        }
    },

    async embedBuild(message, profile){
        const embed = new MessageEmbed()
        .setColor(message.guild.members.cache.get(message.author.id).displayHexColor)
        .setTitle(profile.name)
        .setDescription(profile.clan ? `In a clan **${profile.clan}**` : `Not in a clan`)
        .addField("Level", profile.level.toString(), true)
        .addField("Arena", profile.arena, true)
        .addField("Fav Card", profile.favCard.name, true)
        .addField("Wins/Losses", profile.wins.toString() + "/" + profile.losses.toString(), true)
        .addField("Three Crown Wins", profile.threeCrowns.toString(), true)
        .addField("Trophies", profile.trophies.toString(), true)
        .setThumbnail(profile.favCard.icon)

        return embed;
    },

    async profileFind(tag){
        return cr.getPlayerByTag(tag)
        .then(async (profile) => {
            return {
                name: profile.name,
                level: profile.expLevel,
                clan: profile.clan ? profile.clan.name : false,
                arena: profile.arena.name,
                trophies: profile.trophies,
                wins: profile.wins,
                losses: profile.losses,
                threeCrowns: profile.threeCrownWins,
                favCard: {
                    name: profile.currentFavouriteCard.name,
                    icon: profile.currentFavouriteCard.iconUrls.medium
                }
            }
        })
        .catch((err) => {
            console.log(err.response ? err.response.data ? err.response.data : err.response : err);
            return { err: err.response.data.message ? err.response.data.reason === "accessDenied.invalidIp" ? "Invalid authorization: IP not allowed" : err.response.data.message : "An unknown error happened while searching for Clash Royale profile" }
        })
    }
}