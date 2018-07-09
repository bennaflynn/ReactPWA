var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
});

var User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserByEmail = (email, callback) => {
    User.findOne({email: email}, callback);
}

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.comparePassword = (newPass, hash, callback) => {
    bcrypt.compare(newPass, hash, (err, isMatch) => {
        //if(err) throw err;
        callback(null, isMatch);
    })
}