var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Config = require('../config');
var jwt = require('jsonwebtoken');
var passport = require('passport');

//this registers a new user
router.post('/newuser', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    //are the fields filled out
    if(!email || !password || !password2) {
        return res.json({
            success: false,
            message: 'Please fill out all the fields'
        })
    }
    console.log('Fields filled out');
    //do the passwords match?
    if(password != password2) {
        return res.json({
            success: false,
            message: 'Passwords do not match'
        })        
    }
    console.log('Passwords match');

    //check the database to see if the user with this
    //username already exists
    User.getUserByEmail(email, (err, u) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Something went wrong validating the username'
            })
        }
        console.log(u);
        if(u != null) {
            console.log(u);
            return res.json({
                success: false,
                message: 'A user with this username has already been taken'
            })
        } else {
            console.log('Is a unique username');

             //create the user
            var newUser = new User({
                email: req.body.email,
                password : req.body.password
            })


            //create the new user
            User.createUser(newUser, (err, user) => {
                if(err) {
                    return res.json({
                        success: false,
                        message: 'Error creating user'
                    })
                }
                var token = jwt.sign({data: newUser}, process.env.SECRET_OR_KEY, {expiresIn: 3600})
                res.json({
                    success: true,
                    message: 'New account has been created',
                    token: token
                })
            })
        }
        
    })   
    }
)

//login to your account
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;
        console.log(req.body.email);
        if(!user) {
            res.send({
                success: false,
                message: 'Auth failed, user wasnt found'
            });
        } else {
            User.comparePassword(req.body.password, user.password, (err, isMatch) => {
                if(isMatch && !err) {
                    var token = jwt.sign({data:user},process.env.SECRET_OR_KEY, {expiresIn: 3600});
                    res.json({success:true, token: token});
                    //res.cookie('auth', token);
                } else {
                    res.send({
                        success: false,
                        message: 'Incorrect Password'
                    })
                }
            })
        }
    })
})



module.exports = router;