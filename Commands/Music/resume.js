const { player } = require("../../main");

module.exports = {
    name: "resume",
    aliases: [],
    description: "Resumes the paused song",
    usage: "resume",
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is no queue", allowedMentions: { repliedUser: false } });

        if(!queue.paused) return message.reply({ content: "The queue is not paused", allowedMentions: { repliedUser: false } });

        queue.resume();

        message.react("⏯️");
    }
}