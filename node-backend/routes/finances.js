var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Finance = require('../models/finances');

//get the balanced
router.post('/balance', (req, res) => {
    if(!req.body.email) {
        return res.json({
            'success':false,
            'message':'Error, are you logged in?'
        });
    }

    User.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;

        if(!user) {
            return res.json({
                success: false,
                message: 'User not found'
            })
        }

        Finance.find({'email': req.body.email}, (err, fins) => {
            if(err) throw err;
            //return all the inflows and outflows associated with
            //the account. As in the Email
            return res.json(fins);
        })
    })
})

//add a new expense
router.post('/newflow', (req, res) => {
    if(!req.body.amount) {
        return res.json({
            'success': false,
            'message':'Must have an expense value'
        })
    }
    //check if there is an email attached
    if(!req.body.email) {
        //get out of here the person isn't logged in
        return res.json({
            'success':false,
            'message':'Error, are you logged in?'
        });
    }
    //now does this user exist in the database?
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;
        if(!user) {
            res.send({
                success: false,
                message: 'No user was found with this email'
            });
        } else {
            var newFinance = new Finance({
                email: req.body.email,
                amount: req.body.amount,
                name: req.body.name || "",
                monthly: req.body.monthly || false
            });

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