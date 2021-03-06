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

    reqInfo.timestamp = new Date();

    const requestHistory = new RequestHistoryModel(reqInfo);
    requestHistory.save().then(() => {

    }).catch(err => {
        console.log(err)
    });
}

function getUrlStatsInfo(shortUrl, info, callback) {
    if (info === 'allClicks') {
        RequestHistoryModel.count({ shortUrl: shortUrl }, function (err, count) {
            if (err) {
                // TODO: Log the error, and return the proper error message
                callback({ error: 'error' });
                return;
            }

            callback({ allClicks: count });
        });
        return;
    }

    if (info === 'referer' || info === 'platform' || info === 'browser' || info === 'country' || info === 'hour' || info === 'day' || info === 'month') {
        let groupId = '';

        if (info === 'hour') {
            console.log('Here');
            groupId = {
                year: {$year: "$timestamp"},
                month: {$month: "$timestamp"},
                day: {$dayOfMonth: "$timestamp"},
                hour: {$hour: "$timestamp"},
                minute: {$minute: "$timestamp"}
            };
        } else if (info === 'day') {
            groupId = {
                year: {$year: "$timestamp"},
                month: {$month: "$timestamp"},
                day: {$dayOfMonth: "$timestamp"},
                hour: {$hour: "$timestamp"}
            };
        } else if (info === 'month') {
            groupId = {
                year: {$year: "$timestamp"},
                month: {$month: "$timestamp"},
                day: {$dayOfMonth: "$timestamp"}
            };
        } else {
            groupId = '$' + info;
        }

        RequestHistoryModel
            .aggregate()
            .match({ shortUrl: shortUrl })
            .sort({ timeStamp: -1 })
            .group({ _id: groupId, count: { $sum: 1 } })
            .exec()
            .then(function (data) {
                callback(data);
            }).catch(err => {
                // TODO: Log the error, and return the proper error message
                console.log(err.message);
                callback({ error: 'error' });
            });
        return;
    }

    // TODO: Return the proper error message
    callback({ error: 'error' });
}

module.exports = {
    recordRequest: recordRequest,
    getUrlStatsInfo: getUrlStatsInfo
};