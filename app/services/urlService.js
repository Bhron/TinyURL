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

var getShortUrl = function (longUrl, callback) {
    // return new Promise(function (resolve, reject) {
    //     redisClient.get(longUrl, function (err, shortUrl) {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(shortUrl);
    //         }
    //     });
    // }).then(shortUrl => {
    //     if (shortUrl) {
    //         return shortUrl;
    //     }
    //
    //     return new Promise(function (resolve, reject) {
    //         UrlModel.findOne({ longUrl: longUrl }, function (err, url) {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 var shortUrlId = url.shortUrlId;
    //                 var shortUrl = convertTo62BasedString(shortUrlId);
    //                 resolve(shortUrl);
    //             }
    //         });
    //     });
    // });

    redisClient.get(longUrl, function (err, shortUrl) {
        // TODO: Handle error
        if (err) {

        }

        if (shortUrl) {
            callback(shortUrl)
        } else {
            UrlModel.findOne({ longUrl: longUrl }, function (err, url) {
                // TODO: Handle error
                if (err) {

                }

                if (url) {
                    var shortUrl = convertTo62BasedString(url.shortUrlId);

                    redisClient.set(longUrl, shortUrl);

                    callback(shortUrl);
                } else {
                    // Generate a new short URL Id
                    generateShortUrlId(function (shortUrlId) {
                        var shortUrl = convertTo62BasedString(shortUrlId);

                        var url = new UrlModel({ longUrl: longUrl, shortUrlId: shortUrlId });
                        url.save();

                        redisClient.set(longUrl, shortUrl);
                        redisClient.set(shortUrl, longUrl);

                        callback(shortUrl)
                    });
                }
            });
        }
    });
};

// TODO: Do we need lock the db?
var generateShortUrlId = new Promise(function (resolve, reject) {
    UrlModel.count({}, function (err, count) {
        if (err) {
            reject(err);
        } else {
            resolve(count);
        }
    });
});

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
            UrlModel.findOne({shortUrlID: shortUrlId}, function (err, url) {
                if (err) {
                    reject(err);
                } else {
                    if (!url) {
                        resolve(null);
                    } else {
                        redisClient.set(shortUrl, url.longUrl);
                        resolve(url.longUrl);
                    }
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
