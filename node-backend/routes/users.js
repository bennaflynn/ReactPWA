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


    if(!req.body.email || !req.body.password) {
        res.json({
            success: false,
            message: "Fill out all the feilds",
            
        });
    } else {
        var newUser = new User({
            email: req.body.email,
            password : req.body.password
        })
    

    //create the new user
    User.createUser(newUser, (err, user) => {
        if(err) {
            return req.json({
                success: false,
                message: 'Error creating user'
            })
        }
        var token = jwt.sign({data: newUser}, Config.secret, {expiresIn: 3600})
        res.json({
            success: true,
            message: 'New account has been created'
        })
    })
    }
})

//login to your account
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;

        if(!user) {
            res.send({
                success: false,
                message: 'Auth failed, user wasnt found'
            });
        } else {
            User.comparePassword(req.body.password, user.password, (err, isMatch) => {
                if(isMatch && !err) {
                    var token = jwt.sign({data:user},Config.secret, {expiresIn: 3600});
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