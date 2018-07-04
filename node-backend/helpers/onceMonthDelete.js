var Finances = require('../models/finances');

module.exports =  {
    deleteOnceMonth: function() {
        //console.log('Here we are');
        Finances.deleteMany({ monthly: false, dateAdded: { $lt: new Date() } }, function (err, res) {
            if(err) {
                console.log(err);
            } else {
                //alert('success?');
                console.log("Deletion Success!");
                console.log(res.n + " documents deleted");
                console.log('There is now more space for more bills :/');
            }
        });
    }
}