const { player } = require("../../main");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove",
    aliases: ["r"],
    description: "Removes a song from the queue",
    usage: "remove",
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is nothing playing", allowedMentions: { repliedUser: false } });

        const musicQ = queue.songs;
        const index = args[0];

        if(isNaN(index)) return message.reply({ content: "You need to enter the queue index of the song", allowedMentions: { repliedUser: false } });
        if(index < 1) return message.reply({ content: "You need to remove at least 1 song", allowedMentions: { repliedUser: false } });
        if(index > musicQ.length) return message.reply({ content: "There is no song with such a queue index", allowedMentions: { repliedUser: false } });

        const song = musicQ.splice(index - 1, 1)[0];

        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor(message.channel.guild.members.cache.get(message.author.id).displayHexColor)
                .setTitle("Removed from Queue")
                .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setThumbnail(song.thumbnail)
            ]
        });
    }
}