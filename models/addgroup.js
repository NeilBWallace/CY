// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var addgroupSchema = mongoose.Schema({
        group1:    {type:   String},
        group2:    {type:   String},
        group3:    {type:   String},
        user:    {type:   String}
});

let AddGroup = module.exports = mongoose.model('addgroup',addgroupSchema);