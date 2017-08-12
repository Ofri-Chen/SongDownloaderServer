let artistType = require('./Artist');
let trackType = require('./Track');
let errorType = require('./Error');

module.exports = {
    Artist: artistType.Artist,
    Track: trackType.Track,
    Error: errorType.Error
};

