'use strict';

const express = require('express');
const router = express.Router();

const urlService = require('../services/urlService');
const statsService = require('../services/statsService');

router.get('*', function (req, res) {
    const shortUrl = req.originalUrl.slice(1);

    // Try to get the corresponding short URL
    urlService.getLongUrl(shortUrl).then(longUrl => {
        res.json({
            longUrl: longUrl
        });

        // Log the request information
        // statsService.logRequest(shortUrl, req);
    }).catch(err => {
        // TODO: Handle error
        res.json({
            longUrl: null
        });
    });
});


module.exports = router;
