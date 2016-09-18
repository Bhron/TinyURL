var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
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
