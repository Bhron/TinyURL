var express = require('express')
var router = express.Router()

var urlService = require('../services/urlService')


router.get('*', function (req, res) {
    var shortUrl = req.originalUrl.slice(1)
    
    // Try to get the corresponding short URL
    var longUrl = urlService.getLongUrl(shortUrl)
    if (!longUrl) {
        longUrl = null
    }

    res.json({
        longUrl: longUrl
    })
})


module.exports = router
