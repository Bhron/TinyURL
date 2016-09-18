var UrlModel = require('../models/urlModel');

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


var longUrlToShortUrlIdHash = {};
var shortUrlIdToLongUrlHash = {};


var getShortUrl = function (longUrl, callback) {
    console.log('Herere000')
    console.log(longUrl)
    UrlModel.findOne({ longUrl: longUrl }, function (err, url) {
        // TODO: Handle error
        if (err) {

        }

        if (url) {
            console.log('Herere111111')
            console.log(url.shortUrlId)
            var shortUrl = convertTo62BasedString(url.shortUrlId)
            callback(shortUrl);
        } else {
            // Generate a new short URL Id
            generateShortUrlId(function (shortUrlId) {
                console.log('Herere22222')
                console.log(shortUrlId)
                var url = new UrlModel({ longUrl: longUrl, shortUrlId: shortUrlId });
                url.save();

                var shortUrl = convertTo62BasedString(shortUrlId);
                callback(shortUrl)
            });
            // // Encode the ID to a 62 based string
            // var shortUrl = convertTo62BasedString(shortUrlId)
            //
            // longUrlToShortUrlIdHash[longUrl] = shortUrlId
            // shortUrlIdToLongUrlHash[shortUrlId] = longUrl
            //
            // return shortUrl
        }
    });
    // if (longUrlToShortUrlIdHash[longUrl] != null) {
    //     return longUrlToShortUrlIdHash[longUrl]
    // } else {
    //
    //
    // }
};

var generateShortUrlId = function (callback) {
    // TODO: Do we need lock the db?
    UrlModel.count({}, function (err, count) {
        // TODO: Handle error
        callback(count)
    });
};

var getLongUrl = function (shortUrl, callback) {
    // TODO: Need to check if the shortUrl only contains valid characters first
    // TODO: Also need to handle the overflow for the shortUrlId
    var shortUrlId = decodeShortUrl(shortUrl)
    UrlModel.findOne({ shortUrlID: shortUrlId }, function (err, url) {
        // TODO: Handle error
        if (err || !url) {
            callback(null);
        } else {
            callback(url.longUrl);
        }
    });
    // var shortUrlId = decodeShortUrl(shortUrl)
    // console.log(shortUrlId)
    // return shortUrlIdToLongUrlHash[shortUrlId]
};


module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};
