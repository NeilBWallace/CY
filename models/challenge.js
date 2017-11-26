// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var challengeSchema = mongoose.Schema({
        challenge: {type:   String},
        user_id:    {type:   String},
        id: {type: String},
      
});

let challenge= module.exports = mongoose.model('challenge',challengeSchema);