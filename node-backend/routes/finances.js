var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Expense = require('../models/expenses');


//add a new expense
router.post('/newexpense', (req, res) => {
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
            var newExpense = new Expense({
                email: req.body.email,
                amount: req.body.amount,
                name: req.body.name || "",
                monthly: req.body.monthly || false
            });

            Expense.newExpense(newExpense, (err, exp)=> {
                if(err) {
                    return res.json({
                        success: false,
                        message: 'Something went wrong with the database'
                    })
                } else {
                    return res.json({
                        success: true,
                        message: 'New expense added'
                    })
                }
            })
        }
    })

})

module.exports = router;