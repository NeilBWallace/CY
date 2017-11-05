// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for ouru user model
var challengeSchema = mongoose.Schema({
        challenger:  String,
        challenge:    String,
        challengee: String
});

let Challenge = module.exports = mongoose.model('challenge',challengeSchema);