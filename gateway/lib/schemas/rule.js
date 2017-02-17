const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/gatewayDB');

const Rule = new mongoose.Schema({
    name: {type: String},
    description: {type: String},
    rule: {type: Object}
});

module.exports = mongoose.model('rules', Rule);
