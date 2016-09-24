var UrlModel = require('../models/urlModel');

var redis = require('redis');
var redisHost = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
var redisPort = process.env.REDIS_PORT_6379_TCP_PORT || '6379';
var redisClient = redis.createClient(redisPort, redisHost);

var generateCharArray = function (startChar, endChar) {
    var charArray = [];

    var startCharCode = startChar.charCodeAt(0), endCharCode = endChar.charCodeAt(0);
    while (startCharCode <= endCharCode) {
        charArray.push(String.fromCharCode(startCharCode));
        startCharCode++;
    }

    return charArray;
};

// Generate the array used to encode the long URL
var encoding = generateCharArray('0', '9');
encoding = encoding.concat(generateCharArray('A', 'Z'));
encoding = encoding.concat(generateCharArray('a', 'z'));

// Generate the hash table used to decode the short URL
var decoding = {};
for (var i = 0; i < encoding.length; i++) {
    decoding[encoding[i]] = i;
}

var convertTo62BasedString = function (number) {
    var base = 62;

    var result = "";
    do {
        result = encoding[number % base] + result;
        number = Math.floor(number / 62);
    } while (number > 0);

    return result;
};

var decodeShortUrl = function (shortUrl) {
    var base = 62;

    var shortUrlId = 0;
    for (var i = 0; i < shortUrl.length; i++) {
        shortUrlId = shortUrlId * base + decoding[shortUrl[i]];
    }

    return shortUrlId;
};

var getShortUrl = function (longUrl) {
    return new Promise(function (resolve, reject) {
        redisClient.get(longUrl, function (err, shortUrl) {
            if (err) {
                reject(err);
                return
            }

            if (!shortUrl) {
                resolve({ found: false, shortUrl: null });
            } else {
                resolve({ found: true, shortUrl: shortUrl });
            }
        });
    }).then(result => {
        if (result.found === true) {
            return result;
        }

        return new Promise(function (resolve, reject) {
            UrlModel.findOne({longUrl: longUrl}, function (err, url) {
                if (err) {
                    reject(err);
                    return;
                }

                if (!url) {
                    resolve({ found: false, shortUrl: null });
                } else {
                    var shortUrl = convertTo62BasedString(url.shortUrlId);
                    resolve({ found: true, shortUrl: shortUrl });
                }
            });
        });
    }).then(result => {
        if (result.found === true) {
            return result;
        }

        // Generate the shortUrl
        return generateShortUrl(longUrl).then(shortUrl => {
            return { found: true, shortUrl: shortUrl }
        });
    }).then(result => {
        return result.shortUrl
    }).catch(err => {
        return err
    });
};

var generateShortUrl = function (longUrl) {
    return new Promise(function (resolve, reject) {
        generateShortUrlId(function (err, shortUrlId) {
            if (err) {
                reject(err);
                return;
            }

            var url = new UrlModel({ longUrl: longUrl, shortUrlId: shortUrlId });
            url.save().then(() => {
                var shortUrl = convertTo62BasedString(shortUrlId);
                redisClient.set(longUrl, shortUrl);
                redisClient.set(shortUrl, longUrl);
                resolve(shortUrl);
            }).catch(err => {
                reject(err);
            });
        });
    });
};

// TODO: Do we need lock the db?
var generateShortUrlId = function (callback) {
    UrlModel.count({}, function (err, count) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, count);
        }
    });
};

var getLongUrl = function (shortUrl) {
    // TODO: Need to check if the shortUrl only contains valid characters first
    // TODO: Also need to handle the overflow for the shortUrlId
    return new Promise(function (resolve, reject) {
        redisClient.get(shortUrl, function (err, longUrl) {
            if (err) {
                reject(err);
            } else {
                resolve(longUrl);
            }
        });
    }).then(longUrl => {
        if (longUrl) {
            return longUrl;
        }

        var shortUrlId = decodeShortUrl(shortUrl);
        return new Promise(function (resolve, reject) {
            UrlModel.findOne({ shortUrlID: shortUrlId }, function (err, url) {
                if (err) {
                    reject(err);
                    return;
                }

                if (!url) {
                    resolve(null);
                } else {
                    redisClient.set(shortUrl, url.longUrl);
                    resolve(url.longUrl);
                }
            });
        });
    }).then(longUrl => {
        return longUrl;
    }).catch(err => {
        return err;
    });
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};
