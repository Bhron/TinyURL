var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlService = require('../services/urlService');


router.post('/urls', jsonParser, function (req, res) {
    // TODO: Need to check whether longUrl is undefined
    var longUrl = req.body.longUrl;
    urlService.getShortUrl(longUrl, function (shortUrl) {
        res.json({
            shortUrl: shortUrl,
            longUrl: longUrl
        });
    });
});


module.exports = router;
