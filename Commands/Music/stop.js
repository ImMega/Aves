const { player } = require("../../main");

module.exports = {
    name: "stop",
    aliases: ["leave"],
    description: "Stops the queue if any and leaves",
    usage: "resume",
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);

        if(!queue) return player.voices.leave(message);

        queue.stop();
        player.voices.leave(message);

        message.react("🛑");
    }
}