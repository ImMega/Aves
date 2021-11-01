const { player } = require("../../main");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "volume",
    aliases: ["v"],
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is nothing playing", allowedMentions: { repliedUser: false } });

        if(isNaN(args[0])) return;
        const volume = parseInt(args[0]);

        queue.setVolume(volume);

        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor(message.channel.guild.members.cache.get(message.author.id).displayHexColor)
                .setTitle("Volume Changed")
                .setDescription(`Volume set to **${volume}%**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            ]
        });
    }
}