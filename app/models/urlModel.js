var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    longUrl: String,
    shortUrlId: Number
});

var UrlModel = mongoose.model('Url', urlSchema);


module.exports = UrlModel;
