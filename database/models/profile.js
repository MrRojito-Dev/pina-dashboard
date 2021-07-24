let mongoose = require('mongoose'),
schema = mongoose.Schema({
    ID: { type: String },
    username: { type: String },
    description: { type: String },
    reputation: { type: Number },
    tag: { type: String },
    discriminator: { type: String },
    displayAvatarURL: { type: String },
    avatarCode: { type: String }
});

module.exports = mongoose.model('Profiles', schema);