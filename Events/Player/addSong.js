const { MessageEmbed } = require("discord.js");

module.exports = (queue, song) => {
    if(queue.songs.length === 1) return;

    queue.textChannel.send({
        embeds: [
            new MessageEmbed()
            .setColor(queue.voiceChannel.guild.members.cache.get(song.user.id).displayHexColor)
            .setTitle(`Added to Queue`)
            .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            .setThumbnail(song.thumbnail)
            .setFooter(song.user.tag, song.user.displayAvatarURL({ dynamic: true }))
        ]
    })
}