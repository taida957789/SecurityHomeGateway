const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gatewayDB');

const User = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    token: {type: String},
    token_expired: {type: Date}
});

module.exports = mongoose.model('users', User);
