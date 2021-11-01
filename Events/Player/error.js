module.exports = (channel, err) => {
    channel.send(`Ehh, some error happened in the music player:\n${err}`);
    console.log(err);
}