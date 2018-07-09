//front end is hosted on firebase and can be found on
//https://bensbudgeter.firebaseapp.com
//backend is hosted on heroku and can be found on
//https://bens-budgeting-backend.herokuapp.com

//load this intially
const dotenv = require('dotenv');
dotenv.config();
var express = require('express');
var Config = require('./config');
var port = process.env.PORT || Config.port;
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var passportJWT = require('passport-jwt');
var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;
//import JWT
var jwt = require('jsonwebtoken');

var path = require('path');
var cookieParser = require('cookie-parser');
var schedule = require('node-schedule');
var onceMonthDelete = require('./helpers/onceMonthDelete');

var app = express();

//intiate mongoose
var mongoose = require('mongoose');
mongoose.connect(Config.db);
var db = mongoose.connection;

var User = require('./models/users');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRET_OR_KEY
}

//whenever I get a jwt token, this is what to do with it
const strategy = new JwtStrategy(options, (payload, done) => {
    //get user from DB
    //console.log(payload.data.email);
    User.findOne({email: payload.data.email}, (err, newuser) => {
        console.log('Pass: ' + payload.data.password);
        if(newuser) {
             return done(null, newuser);
        } else {
            return done(null, false);
        }
       
    })
    
})

passport.use(strategy);
app.use(passport.initialize());

//declare url endpoints 
var users = require('./routes/users');
var finances = require('./routes/finances');



//body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({
        'hello': 'is it me you are looking for'
    })
})


app.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('Released');
});




// express session secrets
app.use(session({
    secret: 'soopercrazysesions',
    saveUnititialized: true,
    resave: true
}));

app.use(passport.session());



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
