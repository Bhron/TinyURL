'use strict';

const express = require('express');
const router = express.Router();

const urlService = require('../services/urlService');
const statsService = require('../services/statsService');

router.get('*', function (req, res) {
    const shortUrl = req.originalUrl.slice(1);

    // Try to get the corresponding short URL
    urlService.getLongUrl(shortUrl).then(longUrl => {
        if (longUrl) {
            res.redirect(longUrl);

            // Record the request information
            if (shortUrl !== 'favicon.ico') {
                statsService.recordRequest(req, shortUrl);
            }
        } else {
            sendResponse404(res);
        }
    }).catch(err => {
        sendResponse404(res);
    });
});

const sendResponse404 = function (res) {
    const publicDirPath = __dirname + '/../public/';
    const options = {
        root: publicDirPath
    };
    res.sendFile('views/404.html', options);
};

module.exports = router;
