const { player } = require("../../main");

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Shows the current queue",
    usage: "queue",
    execute(message, args){
        if(!message.member.voice.channel) return message.reply({ content: "You need to be in a VC to use music commands", allowedMentions: { repliedUser: false } });

        if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply({ content: "You need to be in the same VC as me", allowedMentions: { repliedUser: false } });

        const queue = player.getQueue(message);
        if(!queue) return message.reply({ content: "There is nothing playing", allowedMentions: { repliedUser: false } });

        const songsRaw = queue.songs;

        const songs = songsRaw.map((e, i) => {
            return `[${i + 1}] ${e.name} - ${e.formattedDuration} ${i === 0 ? "--- [Now Playing]" : ""}`
        });

        message.channel.send(`\`\`\`ini\n${songs.slice(0, 8).join("\n")}\`\`\``)
        .then(async (msg) => {
            await msg.react("⏮️");
            await msg.react("⏭️");

            const collector = msg.createReactionCollector({ time: 60000 });

            collector.pages = -1;

            collector.on("collect", (reaction, user) => {
                if(user.id !== message.author.id) return; 

                if(reaction.emoji.name === "⏭️"){
                    reaction.users.remove(user);

                    collector.pages++;

                    const page = songs.slice(8 + (8 * collector.pages), 16 + (8 * collector.pages));

                    if(page.length === 0) return collector.pages--;;

                    msg.edit(`\`\`\`ini\n${page.join("\n")}\`\`\``);
                } else if(reaction.emoji.name === "⏮️"){
                    reaction.users.remove(user);

                    if(collector.pages === -1) return;

                    collector.pages--;

                    if(collector.pages === -1){
                        const page = songs.slice(0, 8);

                        msg.edit(`\`\`\`ini\n${page.join("\n")}\`\`\``);
                    } else {
                        const page = songs.slice(8 + (8 * collector.pages), 16 + (8 * collector.pages));

                        msg.edit(`\`\`\`ini\n${page.join("\n")}\`\`\``);
                    }
                }
            })
        })
    }
}