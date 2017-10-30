// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userdetailsSchema = mongoose.Schema({
        username:       String
});

let UserDetails = module.exports = mongoose.model('userdetails',userdetailsSchema);