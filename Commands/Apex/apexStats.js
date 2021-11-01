const { MessageEmbed } = require("discord.js");
const profileModel = require("../../Models/profileSchema");
const { client } = require("../../main");
const Apex = require("apex-api");
const MozambiqueAPI = require("mozambique-api-wrapper");

const apex = new Apex(process.env.APEXTRACKER);
const mozambique = new MozambiqueAPI(process.env.MOZAMBIQUE_API_KEY);

const pc = ["pc"];
const psn = ["ps4", "ps5", "psn", "ps", "playstation"];
const xbl = ["xbox", "xbl", "x1", "xboxone", "seriesx", "xsx"];

module.exports = {
    name: "apexstats",
    aliases: [],
    async execute(message, args, profileData){
        if(!args[0]){
            if(profileData.apexName === "noAccLinked") return message.reply({ content: `You need to enter an Apex username or bind your account with \`${client.prefix + require("./apexBind").name}\``});

            const profile = await this.profileFind(profileData.apexName, profileData.apexPlatform);

            const embed = await this.embedCreate(message, profile);

            message.channel.send({ embeds: [embed] })
        } else {
            const member = message.mentions.members.first();
            
            if(member){
                const memberData = await profileModel.findOne({ userID: member.id });

                if(memberData.apexName === "noAccLinked") return message.reply({ content: "That user doesn't have their Apex account linked", allowedMentions: { repliedUser: false } });

                const profile = await this.profileFind(memberData.apexName, memberData.apexPlatform);

                const embed = await this.embedCreate(message, profile);

                message.channel.send({ embeds: [embed] })
            } else {
                if(!args[0] || !args[1]) return;

                const username = args.splice(1).join(" ");

                let platform;
                if(pc.includes(args[0].toLowerCase())) platform = "PC";
                if(psn.includes(args[0].toLowerCase())) platform = "PSN";
                if(xbl.includes(args[0].toLowerCase())) platform = "XBOX";

                const profile = await this.profileFind(username, platform);

                const embed = await this.embedCreate(message, profile);

                message.channel.send({ embeds: [embed] });
            }
        }
    },

    async embedCreate(message, profile){
        const embed = new MessageEmbed()
            .setColor(message.guild.members.cache.get(client.user.id).displayHexColor)
            .setTitle(profile.name)
            .setDescription("\u200b")
            .setThumbnail(profile.avatarURL)
            .addField("Level", profile.level.toString(), true)
            .addField("Rank", profile.rank.toString(), true)
            .addField("Platform", profile.platform, true)
            .addField("Current Legend", profile.currentLegend.legendName)
            .setImage(profile.currentLegend.legendImage)
    
        for(const stat of profile.legendDisplayValues){
            embed.addField(stat.stat, stat.value.toString(), true)
        }
        return embed;
    },

    async profileFind(username, platform){
        return apex.user(username, platform)
        .then(async (profile) => {
            let name = profile.data.metadata.platformUserHandle;
            let avatarURL = profile.data.metadata.avatarUrl;
            let level = profile.data.metadata.level;
            let rank = profile.data.metadata.rankName;
            let currentLegend;
            let legendDisplayValues = [];

            if(platform === "PSN") name = await mozambique.search({ platform: "PS4", player: username })
            .then((data) => {
                return data.global.name;
            })
            .catch((err) => console.log(err))

            for(let i = 0; i < profile.data.children.length + 1; i++){
                if(profile.data.children[i].metadata.is_active){
                    currentLegend = { legendName: profile.data.children[i].metadata.legend_name, legendImage: profile.data.children[i].metadata.bgimage }
                    
                    for(let ii = 0; ii < 3 && ii < profile.data.children[i].stats.length; ii++){
                        legendDisplayValues.push({ stat: profile.data.children[i].stats[ii].metadata.name, value: profile.data.children[i].stats[ii].displayValue })
                    }
                    break;
                }
            }

            return {
                name: name,
                avatarURL: avatarURL,
                level: level,
                rank: rank,
                platform: platform,
                currentLegend: currentLegend,
                legendDisplayValues: legendDisplayValues
            }
        })
    }
}