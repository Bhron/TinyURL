"use strict";

const geoip = require('geoip-lite');
const RequestHistoryModel = require('../models/requestHistoryModel');

function recordRequest(req, shortUrl) {
    const reqInfo = {};

    reqInfo.shortUrl = shortUrl;
    reqInfo.referer = req.headers.referer || 'Unknown';
    reqInfo.platform = req.useragent.platform || 'Unknown';
    reqInfo.browser = req.useragent.browser || 'Unknown';

    const ip = req.headers['x-forwarded-for']
        || req.connection.remoteAddress
        || req.socket.remoteAddress
        || req.connection.socket.remoteAddress;

    const geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.country = geo.country;
    } else {
        reqInfo.country = 'Unknown';
    }

    reqInfo.timeStamp = new Date();

    const requestHistory = new RequestHistoryModel(reqInfo);
    requestHistory.save().then(() => {

    }).catch(err => {
        console.log(err)
    });
}

function getUrlInfo(shortUrl, info, callback) {
    if (info === 'allClicks') {
        RequestHistoryModel.count({ shortUrl: shortUrl }, function (err, data) {
            callback(data);
        });
        return;
    }

    if (info === 'referer') {

        return;
    }
}

module.exports = {
    recordRequest: recordRequest,
    getUrlInfo: getUrlInfo
};