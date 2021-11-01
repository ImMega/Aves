const { client } = require("../../main")

module.exports = () => {
    console.log(`${client.user.username} is now online!`);
}