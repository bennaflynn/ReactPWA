var mongoose = require('mongoose');

var ExpenseSchema = mongoose.Schema({
    //the account holders email
    email: {
        type: String
    },
    amount : {
        type: Number
    },
    name: {
        type: String
    },
    monthly: {
        type: Boolean
    }

})

var Expense = module.exports = mongoose.model('expenses', ExpenseSchema);

module.exports.newExpense = (newExp, callback) => {
    newExp.save(callback);
}

module.exports.deleteExpense = (params, callback) => {
    Expense.remove(params, callback);
}

