var express = require('express');
var app = express();

var mongoose = require('mongoose');
// Let the mongoose use the native ES6 promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dev:dev@ds027509.mlab.com:27509/tiny_url');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connect to mongodb successfully.')
});

var apiRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');

// TODO: Need to check if it is JSON and whether the format is valid
app.use('/api/v1', apiRouter);
app.use('/:shortURL', redirectRouter);

app.listen(3000);
