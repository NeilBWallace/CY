// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var addhobbySchema = mongoose.Schema({
        hobby:    {type:   String},
        user:    {type:   String}
});

let AddHobby = module.exports = mongoose.model('addhobby',addhobbySchema);