'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    const publicDirPath = __dirname + '/../public/';
    const options = {
        root: publicDirPath
    };
    res.sendFile('views/index.html', options);
});

module.exports = router;
