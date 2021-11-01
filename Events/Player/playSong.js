const { client } = require("../../main");
const { MessageEmbed } = require("discord.js");

module.exports = (queue, song) => {
    if(queue.playingMsg) queue.playingMsg.delete();

    queue.textChannel.send({
        embeds:
        [
            new MessageEmbed()
            .setColor(queue.voiceChannel.guild.members.cache.get(client.user.id).displayHexColor)
            .setTitle("Now Playing")
            .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            .setFooter(song.user.tag, song.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(song.thumbnail)
        ]
    }).then(msg => {
        queue.playingMsg = msg;
    })
}