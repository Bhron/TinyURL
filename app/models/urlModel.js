'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    longUrl: String,
    shortUrlId: Number
});

const UrlModel = mongoose.model('Url', urlSchema);


module.exports = UrlModel;
