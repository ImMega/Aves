const { client } = require("../../main");
const { MessageEmbed } = require("discord.js");

module.exports = {
    async profile(message, profile){
        const embed = new MessageEmbed()
        .setColor(message.guild.members.cache.get(message.author.id).displayHexColor)
        .setAuthor(profile.profile.name, ``, profile.profile.link)
        .setDescription(`**▸Rank:** #${profile.rank.global} (${profile.profile.country.code} #${profile.rank.country})\n`
                        + `**▸Lvl:** ${profile.level.current.toString()} (${profile.level.progress}%)\n`
                        + `**▸PP:** ${profile.pp} **Acc:** ${profile.acc}\n`
                        + `**▸Playcount:** ${profile.plays.count} (${profile.plays.hours}h)\n`
                        + `**▸Scores:** ${profile.scores.total}\n`
                        + `**▸Ranked Scores:** ${profile.scores.ranked}`)
        .setThumbnail(profile.profile.pfp)
        .setFooter(`Joined on ${profile.profile.joinDate.toUTCString()}`, profile.profile.country.icon)
    
        return embed;
    },

    async score(message, recent){
        if(recent.score) return await this.scoreSingle(message, recent);

        if(recent.scores) return await this.scoreMultiple(message, recent)
    },

    async scoreSingle(message, recent){
        console.log(recent)
        const embed = new MessageEmbed()
        .setColor(message.guild.members.cache.get(message.author.id).displayHexColor)
        .setAuthor(recent.user.name, recent.user.pfp, recent.user.link)
        .setTitle(`${recent.score.beatmap.artist} - ${recent.score.beatmap.title} (${recent.score.beatmap.creator}) [${recent.score.beatmap.diff}] +${recent.score.mods}`)
        .setDescription(`**▸** ${recent.score.rank.emoji}${recent.score.pp !== null ? ` ▸ **${recent.score.pp}PP**` : ``} ▸ ${recent.score.acc}% ▸ **${recent.score.starDiff}★**\n`
                    + `▸ ${recent.score.score} ▸ ${recent.score.combo}x${recent.score.beatmap.maxCombo ? `/${recent.score.beatmap.maxCombo}x` : ``} ▸ [${recent.score.counts[300]}/${recent.score.counts[100]}/${recent.score.counts[50]}/${recent.score.counts.miss}]\n`
                    + `**▸ Beatmap Status:** ${recent.score.beatmap.status}`)
        .setURL(recent.score.beatmap.mapLink)
        .setThumbnail(recent.score.beatmap.thumbnail)
        .setFooter(`Achieved on ${recent.score.date.toUTCString()}`)

        return embed;
    },

    async scoreMultiple(message, recent){
        console.log(recent)
        const embed = new MessageEmbed()
        .setColor(message.guild.members.cache.get(message.author.id).displayHexColor)
        .setAuthor(recent.user.name, recent.user.pfp, recent.user.link)
        .setFooter(`${recent.user.name}'s ${recent.scores.length} recent plays`)

        for(i = 0; i < recent.scores.length; i++){
            embed.addField(`${i + 1}. ${recent.scores[i].beatmap.artist} - ${recent.scores[i].beatmap.title} (${recent.scores[i].beatmap.creator}) [${recent.scores[0].beatmap.diff}] +${recent.scores[i].mods}`,
                        `${recent.scores[i].rank.emoji} |${recent.scores[i].pp !== null ? ` ${recent.scores[i].pp}PP |` : ``} ${recent.scores[i].combo} | ${recent.scores[i].acc} | ${recent.scores[i].counts.miss}❌`)
        }

        return embed;
    }
}