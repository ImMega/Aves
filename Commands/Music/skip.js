const { player } = require("../../main");

module.exports = {
    name: "skip",
    aliases: [],
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is nothing playing", allowedMentions: { repliedUser: false } });

        if(queue.songs.length === 1){
            queue.stop();

            message.react("⏭️");
        } else {
            queue.skip();

            message.react("⏭️");
        }
    }
}