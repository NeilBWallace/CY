// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var hobbySchema = mongoose.Schema({
        hobby:    {type:   String,unique:true}
});

let Hobby = module.exports = mongoose.model('hobby',hobbySchema);