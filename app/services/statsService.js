var geoip = require('geoip-lite');

var logRequest = function (req) {
    var reqInfo = {};

    reqInfo.shortUrl = req.originalUrl.slice(1);
    reqInfo.referer = req.headers.referer || 'Unknown';
    reqInfo.platform = req.useragent.platform || 'Unknown';
    reqInfo.browser = req.useragent.browser || 'Unknown';

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.country = geo.country;
    } else {
        reqInfo.country = 'Unknown';
    }

    reqInfo.timeStamp = new Date();


};

module.exports = {
    logRequest: logRequest
};