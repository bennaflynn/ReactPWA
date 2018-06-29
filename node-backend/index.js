var express = require('express');
var Config = require('./config');
var port = process.env.PORT || Config.port;
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


//url endpoints 

var app = express();

//intiate mongoose
var mongoose = require('mongoose');
mongoose.connect(Config.db);
var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send({
        'hello': 'is it me you are looking for'
    })
})

app.listen(port, (err, res) => {
    if(err) {
        console.log(err);
    } else {
        console.log('Server started and listening on port ' + port);
    }
} )
