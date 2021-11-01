module.exports = {
    name: "test",
    aliases: [],
    execute(message){
        console.log(message.guild.iconURL({dynamic: true}))
    }
}