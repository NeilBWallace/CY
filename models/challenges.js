// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var challengeSchema = mongoose.Schema({
        challenger: {type:   String},
        challenged:    {type:   String},
        id: {type: String},
        status: {type:String}
        
});

let Challenges= module.exports = mongoose.model('challenges',challengeSchema);