const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gatewayDB');

const Group = new Schema({
    name: {type: String}
});

module.exports = mongoose.model('groups', Group);
