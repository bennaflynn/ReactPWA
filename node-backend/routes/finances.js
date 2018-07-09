var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Finance = require('../models/finances');
var passport = require('passport');
var jwt = require('jsonwebtoken');

//get the balanced
router.get('/balance', passport.authenticate('jwt',{session:false}), (req, res) => {

    //get the email from the JWT token
    var newAuth = req.headers.authorization.replace('jwt ','');
    var decoded = jwt.verify(newAuth, process.env.SECRET_OR_KEY);
    

    User.findOne({email: decoded.data.email}, (err, user) => {
        if(err) throw err;

        if(!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        Finance.find({'email': decoded.data.email}, (err, fins) => {
            if(err) throw err;
            //return all the inflows and outflows associated with
            //the account. As in the Email
            return res.json(fins);
        })
    })
})

//add a new expense
router.post('/newflow', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(!req.body.amount) {
        return res.json({
            'success': false,
            'message':'Must have an expense value'
        })
    }
    
    //get the email from the JWT token
    var newAuth = req.headers.authorization.replace('jwt ','');
    var decoded = jwt.verify(newAuth, process.env.SECRET_OR_KEY);

    //now does this user exist in the database?
    User.findOne({email: decoded.data.email}, (err, user) => {
        if(err) throw err;
        if(!user) {
            res.send({
                success: false,
                message: 'No user was found with this email'
            });
        } else {
            var newFinance = new Finance({
                email: decoded.data.email,
                amount: req.body.amount,
                name: req.body.name || "",
                monthly: req.body.monthly || false,
                dateAdded: new Date()
            });

            //console.log(newFinance.dateAdded);

            Finance.newFinance(newFinance, (err, exp)=> {
                if(err) {
                    return res.json({
                        success: false,
                        message: 'Something went wrong with the database'
                    })
                } else {
                    return res.json({
                        success: true,
                        message: 'New flow added'
                    })
                }
            })
        }
    })

})

module.exports = router;