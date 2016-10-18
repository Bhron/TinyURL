'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestHistorySchema = new Schema({
    shortUrl: String,
    referer: String,
    platform: String,
    browser: String,
    country: String,
    timestamp: Date
});

const RequestHistoryModel = mongoose.model('RequestHistory', requestHistorySchema);

module.exports = RequestHistoryModel;
