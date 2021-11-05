module.exports = (channel, err) => {
    if(err.message === "Sign in to confirm your age") return channel.send("The song is age restricted and I can't play it")
    channel.send(`Ehh, some error happened in the music player:\n\`${err.name} ${err.message}\``);
    console.log(err);
}