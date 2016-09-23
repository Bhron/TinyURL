var express = require('express');
var router = express.Router();

var urlService = require('../services/urlService');


router.get('*', function (req, res) {
    var shortUrl = req.originalUrl.slice(1);

    // Try to get the corresponding short URL
    urlService.getLongUrl(shortUrl).then(longUrl => {
        if (!longUrl) {
            longUrl = null;
        }

        res.json({
            longUrl: longUrl
        });
    }).catch(err => {
        // TODO: Handle error
        res.json({
            longUrl: null
        });
    });
});


module.exports = router;
