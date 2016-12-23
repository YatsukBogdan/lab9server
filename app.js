const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');


var getsongs = require('./routes/getsongs');
var checkuserexist = require('./routes/checkuserexist');
var isauthorized = require('./routes/isauthorized');
var getsong = require('./routes/getsong');
var addsong = require('./routes/addsong');
var findsong = require('./routes/findsong');
var deletesong = require('./routes/deletesong');
var updatesong = require('./routes/updatesong');
var uploadimage = require('./routes/uploadimage');
var login = require('./routes/login');
var loadusers = require('./routes/loadusers');
var register = require('./routes/register');
var logout = require('./routes/logout');
var songcount = require('./routes/songcount');

const app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));

mongoose.connect('mongodb://localhost:27017/hp');
app.use(expressSession({
    secret: 'a4f8071f-c873-4447-8ee2',
    cookie: { maxAge: 2628000000 },
    store: (require('express-sessions'))({
        storage: 'mongodb',
        instance: mongoose, // optional
        host: 'localhost', // optional
        port: 27017, // optional
        db: 'hp', // optional
        collection: 'sessions', // optional
        expire: 86400 // optional
    })
}));


app.use('/getsongs', getsongs);
app.use('/checkuserexist', checkuserexist);
app.use('/getsong', getsong);
app.use('/addsong', addsong);
app.use('/deletesong', deletesong);
app.use('/findsong', findsong);
app.use('/updatesong', updatesong);
app.use('/uploadimage', uploadimage);
app.use('/isauthorized', isauthorized);
app.use('/songcount', songcount);
app.use('/login', login);
app.use('/loadusers', loadusers);
app.use('/register', register);
app.use('/logout', logout);

module.exports = app;
