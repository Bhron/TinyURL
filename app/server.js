'use strict';

const express = require('express');
const app = express();

const mongoose = require('mongoose');
// Let the mongoose use the native ES6 promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dev:dev@ds027509.mlab.com:27509/tiny_url');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connect to mongodb successfully.')
});

const indexRouter = require('./routes/index');
const useragent = require('express-useragent');
const apiRouter = require('./routes/rest');
const redirectRouter = require('./routes/redirect');

// TODO: Need to check if it is JSON and whether the format is valid
app.use('/public', express.static(__dirname + '/public'));
app.use('/modules', express.static(__dirname + '/node_modules'));
app.use('/', indexRouter);
app.use(useragent.express());
app.use('/api/v1', apiRouter);
app.use('/:shortURL', redirectRouter);

app.listen(3000);
