const { player } = require("../../main");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is no queue to loop", allowedMentions: { repliedUser: false } });

        let mode;
        switch (args[0]){
            case "off":
                mode = 0
                break
            case "song":
                mode = 1
                break
            case "queue":
                mode = 2
                break
        }

        mode = queue.setRepeatMode(mode);
        mode = mode ? mode === 2 ? "queue" : "song" : "off";

        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor(message.guild.members.cache.get(message.author.id).displayHexColor)
                .setDescription(`Queue mode set to: \`${mode}\``)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            ]
        });
    }
}