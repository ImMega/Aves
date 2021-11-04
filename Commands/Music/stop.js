const { player } = require("../../main");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    name: "stop",
    aliases: ["leave"],
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        const connection = getVoiceConnection(message.guild.id)

        if(!queue) return connection.destroy();

        queue.stop();
        connection.destroy();

        message.react("🛑");
    }
}