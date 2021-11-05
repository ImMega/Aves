module.exports = {
    name: "ping",
    aliases: [],
    description: "Shows bot's message ping",
    usage: "ping",
    execute(message, args){
        message.channel.send("Measuring my ping...").then(msg => {
            msg.edit(`My message ping is **${msg.createdTimestamp - message.createdTimestamp}ms**`);
        })
    }
}