var mongoose = require('mongoose');

var FinanceSchema = mongoose.Schema({
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

var Finance = module.exports = mongoose.model('finances', FinanceSchema);

module.exports.newFinance = (newFin, callback) => {
    newFin.save(callback);
}

module.exports.deleteFinance = (params, callback) => {
    Finance.remove(params, callback);
}



