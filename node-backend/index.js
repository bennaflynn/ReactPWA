var express = require('express');
var Config = require('./config');
var port = process.env.PORT || Config.port;
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var schedule = require('node-schedule');
var onceMonthDelete = require('./helpers/onceMonthDelete');

//local strategy
var LocalStrategy = require('passport-local').Strategy;

//declare url endpoints 
var users = require('./routes/users');
var finances = require('./routes/finances');

var app = express();

//intiate mongoose
var mongoose = require('mongoose');
mongoose.connect(Config.db);
var db = mongoose.connection;

//body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({
        'hello': 'is it me you are looking for'
    })
})


//import JWT
var jwt = require('jsonwebtoken');

// express session
app.use(session({
    secret: 'soopercrazysesions',
    saveUnititialized: true,
    resave: true
}));

//intialize passport
app.use(passport.initialize());
app.use(passport.session());

//use the passport strategy defined
require('./passport')(passport);

//allow cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

//define url endpoints
app.use('/users', users);
app.use('/finances', finances);

//define the scheduled delete of the database
var rule = new schedule.RecurrenceRule();
//do this on the first of each month
rule.date = 1;

var job = schedule.scheduleJob(rule, () => {
   //this deletes all the incomes/expenses that 
   //are not monthly. It does this because or else
   //the database would be full of trivial expenses 
   //and would be a burden to access. Due to the 
   //nature of the app, you only want consistent
   //across months are those incomes/expenses that
   //are actually monthly. The database doesn't 
   //need to know you bought a pornhub subscription
   //(a one off purchase) last april
    onceMonthDelete.deleteOnceMonth();
})


app.listen(port, (err, res) => {
    if(err) {
        console.log(err);
    } else {
        console.log('Server started and listening on port ' + port);
    }

    
} )
