const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

passport.use(new LocalStrategy(
    (email, password, done) => {
        User.findOne({email: email}, (err, user) => {
            if(err) return done(err);

            if(!user) {
                return done(null, false);
            }
            console.log('User exists');
            //now check if the passwords match
            bcrypt.compare(password, user.password, (err, isValid) => {
                if(err) return done(err);

                if(!isValid) {
                    return done(null, false);
                }

                return done(null, user);
            })
        })
    }
))

// //import the JWT strategies
// var JwtStrategy = require('passport-jwt').Strategy;
// var ExtractJwt = require('passport-jwt').ExtractJwt;
// var User = require('./models/users');
// var Config = require('./config');

// module.exports = function(passport) {
//     var jwtOptions = {
//         //check the headers for JWT
//         jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
//         ,
//         //Where to find the secret/key
//         secretOrKey: Config.secret
//     };

//     passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
//         console.log(jwt_payload._id);
//         User.findOne({id: jwt_payload.sub}, (err, user) => {
//             if(err) {
//                 return done(err, false);
//             }

//             if(user) {
//                 done(null, user);
//             } else {
//                 done(null, false);
//             }
//         });
//     }));
// };