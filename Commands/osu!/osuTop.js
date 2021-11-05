const osuH = require("../../Helpers/osuHelper");
const profileModel = require("../../Models/profileSchema");

module.exports = {
    name: "top",
    aliases: [],
    description: "Shows top plays for an osu! account",
    usage: "top [username] [mode] [amount]",
    async execute(message, args, profileData){
        if(!args[0] && profileData.osuID === "noAccLinked") return message.reply({ content: `You need to enter the user you want to check or bind an account using \`${client.prefix}osubind\``, allowedMentions: { repliedUser: false } });

        const target = message.mentions.users.first();

        if(target && args[0].includes("@")){
            const targetProfile = await profileModel.findOne({ userID: target.id });

            if(targetProfile.osuID === "noAccLinked") return message.reply({ content: "That user doesn't have binded osu! account!", allowedMentions: { repliedUser: false } });

            if(args[1] && args[1].includes("-")){
                const mode = await osuH.findMode(args[1]);

                if(!mode && mode !== 0) return message.reply({ content: "You need to enter a real osu! game mode", allowedMentions: { repliedUser: false } });

                let amount = 1;
                if(args[2] && !isNaN(args[2])) amount = args[2];
                if(args[1] && !args[1].includes("-") && !isNaN(args[1])) amount = args[1];

                if(amount < 1) return message.reply({ content: "You need to request at least 1 play", allowedMentions: { repliedUser: false } });
                if(amount > 5) return message.reply({ content: "You can't request more than 5 plays at once", allowedMentions: { repliedUser: false } });
                
                const top = await osuH.getTop(targetProfile.osuID, mode, amount);

                if(top.err) return message.reply({ content: top.err, allowedMentions: { repliedUser: false } });
                if(top.apiErr) return message.reply({ content: "An error happened while fetching the top plays", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.score(message, top);

                message.channel.send({ content: `Top **${top.mode}** ${top.score ? `play` : `plays`} for **${top.user.name}**:`, embeds: [embed] })
            } else {
                let amount = 1;
                if(args[1] && !isNaN(args[1])) amount = args[1];

                if(amount < 1) return message.reply({ content: "You need to request at least 1 play", allowedMentions: { repliedUser: false } });
                if(amount > 5) return message.reply({ content: "You can't request more than 5 plays at once", allowedMentions: { repliedUser: false } });

                const top = await osuH.getTop(targetProfile.osuID, profileData.osuMode, amount);

                if(top.err) return message.reply({ content: top.err, allowedMentions: { repliedUser: false } });
                if(top.apiErr) return message.reply({ content: "An error happened while fetching the top plays", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.score(message, top);

                message.channel.send({ content: `Top **${top.mode}** ${top.score ? `play` : `plays`} for **${top.user.name}**:`, embeds: [embed] })
            }
        } else {
            let modeI = await args.findIndex((e) => ["-standard", "-std", "-0"].includes(e) || ["-taiko", "-1"].includes(e) || ["-ctb", "-catch", "-2"].includes(e) || ["-mania", "-3"].includes(e));

            if(!args[0] || (!isNaN(args[0]) && !args[1]) || modeI === 0){
                let mode = profileData.osuMode;
                let amount = 1;
 
                if(modeI === 0 && args[1] && !isNaN(args[1])) amount = args[1];
                if(modeI === -1 && args[0] && !isNaN(args[0])) amount = args[0];
                if(modeI === 0) mode = await osuH.findMode(args[0]);

                if(amount < 1) return message.reply({ content: "You need to request at least 1 play", allowedMentions: { repliedUser: false } });
                if(amount > 5) return message.reply({ content: "You can't request more than 5 plays at once", allowedMentions: { repliedUser: false } });

                const top = await osuH.getTop(profileData.osuID, mode, amount);

                if(top.err) return message.reply({ content: top.err, allowedMentions: { repliedUser: false } });
                if(top.apiErr) return message.reply({ content: "An error happened while fetching the top plays", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.score(message, top);

                message.channel.send({ content: `Top **${top.mode}** ${top.score ? `play` : `plays`} for **${top.user.name}**:`, embeds: [embed] });
            } else {
                let username = args.join(" ");
                let mode = profileData.osuMode;
                let amount = 1;

                if(modeI && modeI !== -1) username = args.slice(0, modeI).join(" ");
                if(modeI) mode = await osuH.findMode(args[modeI]);
                if(modeI && modeI !== -1 && args[modeI + 1] && !isNaN(args[modeI + 1])) amount = args[modeI + 1]; 

                if(amount < 1) return message.reply({ content: "You need to request at least 1 play", allowedMentions: { repliedUser: false } });
                if(amount > 5) return message.reply({ content: "You can't request more than 5 plays at once", allowedMentions: { repliedUser: false } });

                const top = await osuH.getTop(username, mode, amount);

                if(top.err) return message.reply({ content: top.err, allowedMentions: { repliedUser: false } });
                if(top.apiErr) return message.reply({ content: "An error happened while fetching the top plays", allowedMentions: { repliedUser: false } });

                const embed = await osuH.embedBuild.score(message, top);

                message.channel.send({ content: `Top **${top.mode}** ${top.score ? `play` : `plays`} for **${top.user.name}**:`, embeds: [embed] });
            }
        }
    }
}