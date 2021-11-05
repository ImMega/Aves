const { client } = require("../../main");
const profileModel = require("../../Models/profileSchema");
const { MessageEmbed } = require("discord.js");
const osuH = require("../../Helpers/osuHelper");

module.exports = {
    name: "osu",
    aliases: [],
    description: "Shows an osu! account",
    usage: "osu [username] [osu! game mode]",
    async execute(message, args, profileData){
        if(!args[0] && profileData.osuID === "noAccLinked") return message.reply({ content: `You need to enter the user you want to check or bind an account using \`${client.prefix}osubind\``, allowedMentions: { repliedUser: false } });

        const target = message.mentions.users.first();

        if(target && args[0].includes("@")){
            const targetProfile = await profileModel.findOne({ userID: target.id });

            if(targetProfile.osuID === "noAccLinked") return message.reply({ content: "That user doesn't have binded osu! account!", allowedMentions: { repliedUser: false } });

            if(args[1] && args[1].includes("-")){
                const mode = await osuH.findMode(args[1]);

                if(!mode && mode !== 0) return message.reply({ content: "You need to enter a real osu! game mode", allowedMentions: { repliedUser: false } });

                const profile = await osuH.getUser(targetProfile.osuID, mode);

                if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });
                if(profile.apiErr) return message.reply({ content: "An error happened while searching for an osu! profile", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.profile(message, profile);

                message.channel.send({ content: `**${profile.mode}** profile for **${profile.profile.name}**`, embeds: [embed] });
            } else {
                const profile = await osuH.getUser(targetProfile.osuID, profileData.osuMode);

                if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });
                if(profile.apiErr) return message.reply({ content: "An error happened while searching for an osu! profile", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.profile(message, profile);

                message.channel.send({ content: `**${profile.mode}** profile for **${profile.profile.name}**`, embeds: [embed] });
            }
        } else {
            let modeI = await args.findIndex((e) => ["-standard", "-std", "-0"].includes(e) || ["-taiko", "-1"].includes(e) || ["-ctb", "-catch", "-2"].includes(e) || ["-mania", "-3"].includes(e));

            if(!args[0] || modeI === 0){
                let mode = profileData.osuMode;

                if(modeI === 0) mode = await osuH.findMode(args[0]);
                
                const profile = await osuH.getUser(profileData.osuID, mode);

                if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });
                if(profile.apiErr) return message.reply({ content: "An error happened while searching for an osu! profile", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.profile(message, profile);

                message.channel.send({ content: `**${profile.mode}** profile for **${profile.profile.name}**`, embeds: [embed] });
            } else {
                let username = args.join(" ");
                let mode = profileData.osuMode;
                if(modeI && modeI !== -1) username = args.slice(0, modeI).join(" ");
                if(modeI) mode = await osuH.findMode(args[modeI]);

                const profile = await osuH.getUser(username, mode);

                if(profile.err) return message.reply({ content: profile.err, allowedMentions: { repliedUser: false } });
                if(profile.apiErr) return message.reply({ content: "An error happened while searching for an osu! profile", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.profile(message, profile);

                message.channel.send({ content: `**${profile.mode}** profile for **${profile.profile.name}**`, embeds: [embed] });
            }
        }
    }
}