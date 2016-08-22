var express = require('express')
var app = express()

var apiRouter = require('./routes/REST')
var redirectRouter = require('./routes/redirect')

// Need to valid if it is JSON and whether the format is valid
app.use('/api/v1', apiRouter)
app.use('/:shortURL', redirectRouter)

app.listen(3000)
