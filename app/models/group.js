// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var groupSchema = mongoose.Schema({
        group:       String
});

let Group = module.exports = mongoose.model('group',groupSchema);