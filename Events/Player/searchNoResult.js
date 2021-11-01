module.exports = (message) => {
    message.reply({ content: "Ehh, couldn't find anything... Maybe try other keywords?", allowedMentions: { repliedUser: false } });
}