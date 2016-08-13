var generateCharArray = function (startChar, endChar) {
    var charArray = []

    var startCharCode = startChar.charCodeAt(0), endCharCode = endChar.charCodeAt(0)
    while (startCharCode <= endCharCode) {
        charArray.append(String.fromCharCode(startCharCode))
        startCharCode++
    }

    return charArray
}

// Generate the characters array used to encode the URL
var encodingChars = generateCharArray('0', '9')
encodingChars = encodingChars.concat(generateCharArray('A', 'Z'))
encodingChars = encodingChars.concat(generateCharArray('a', 'z'))

var convertTo62 = function (number) {
    var base = 62

    var result = ""
    do {
        result = encodingChars[number % base] + result
        number = Math.floor(number / 62)
    } while (number > 0)

    return result
}


var longURLToShortURLHash = {}
var shortURLToLongURLHash = {}

var generateShortURL = function () {
    return Object.keys(shortURLToLongURLHash).length
}

var getShortURL = function (longURL) {
    if (longURLToShortURLHash[longURL] != null) {
        return longURLToShortURLHash[longURL]
    } else {
        var shortURL = generateShortURL()
        longURLToShortURLHash[longURL] = shortURL
        shortURLToLongURLHash[shortURL] = longURL
        return shortURL
    }
}

var getLongURL = function (shortURL) {
    return shortURLToLongURLHash[shortURL]
}


module.exports = {
    getShortURL: getShortURL,
    getLongURL: getLongURL
}
