// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var friendSchema = mongoose.Schema({
        user: {type:   String},
        friend:    {type:   String},
        status: {type: String}
// 0 not friends
// 1 friendrequest sent
// 2 friends        
});

friendSchema.index({user:1,friend:1},{unique:true})
let Friends = module.exports = mongoose.model('friend',friendSchema);