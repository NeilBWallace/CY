// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var chSchema = mongoose.Schema({
        challenge: {type:   String},
        user_id:    {type:   String},
        id: {type: String},
      
});

let ch= module.exports = mongoose.model('ch',chSchema);