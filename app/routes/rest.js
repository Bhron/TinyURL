'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const urlService = require('../services/urlService');
const statsService = require('../services/statsService');

router.post('/urls', jsonParser, function (req, res) {
    // TODO: Need to check whether longUrl is undefined
    const longUrl = req.body.longUrl;
    urlService.getShortUrl(longUrl).then(shortUrl => {
        res.json({
            shortUrl: shortUrl,
            longUrl: longUrl
        });
    }).catch(err => {
        // TODO: Handle error
        res.json({
            shortUrl: null,
            longUrl: null
        });
    });
});

router.get('/urls/:shortUrl', function (req, res) {
    const shortUrl = req.params.shortUrl;
    // TODO: Need to check whether shortUrl is undefined
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

router.get('/urls/:shortUrl/:info', function (req, res) {
    statsService.getUrlStatsInfo(req.params.shortUrl, req.params.info, function (data) {
        res.json(data);
    });
});

module.exports = router;
