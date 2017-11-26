// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var cSchema = mongoose.Schema({
        challenger: {type:   String},
        challenged:    {type:   String},
        id: {type: String},
        status: {type:String}
        
});

let c= module.exports = mongoose.model('c',cSchema);