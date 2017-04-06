const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gatewayDB');

const User = new Schema({
    username: {type: String},
    password: {type: String},
    groups: [{type: Schema.ObjectId, ref: 'groups'}],
    token: {type: String},
    token_expired: {type: Date}
});

module.exports = mongoose.model('users', User);
