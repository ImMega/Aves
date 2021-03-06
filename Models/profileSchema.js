const mongoose = require(`mongoose`);

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    serverID: {type: String, require: true},
    apexName: {type: String},
    apexPlatform: {type: String},
    osuID: {type: String},
    osuMode: {type: Number}
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;