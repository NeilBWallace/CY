// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for ouru user model
var groupSchema = mongoose.Schema({
        group:   {type: String, unique: true}
});

let Group = module.exports = mongoose.model('group',groupSchema);