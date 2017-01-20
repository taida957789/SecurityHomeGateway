const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    token: {type: String},
    token_expired: {type: Date}
});

module.exports = mongoose.model('users', User);
