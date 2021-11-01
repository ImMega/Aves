const { player, client } = require("../../main");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "current"],
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is nothing playing", allowedMentions: { repliedUser: false } });

        const song = queue.songs[0];

        function createProgressBar(queue, song){
            const progress = ((queue.currentTime / song.duration) * 100).toFixed(0);
            let progressArr = [];
            
            for (i = 1; i < 11; i++){
                if(progress > (10 * i) - 1 || progressArr.find(e => e === "🔘")){
                    progressArr.push("▬");
                } else if(progress < (10 * i) - 1){
                    progressArr.push("🔘");
                }
            }
            
            return progressArr.join("");
        }

        const progressBar = createProgressBar(queue, song);

        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor(message.channel.guild.members.cache.get(client.user.id).displayHexColor)
                .setTitle(song.name)
                .setURL(song.url)
                .setDescription(`${queue.formattedCurrentTime} | ${progressBar} | ${song.formattedDuration}`)
                .setThumbnail(song.thumbnail)
                .setFooter(song.user.tag, song.user.displayAvatarURL({ dynamic: true }))
            ]
        });
    }
}