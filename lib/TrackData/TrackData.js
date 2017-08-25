var q = require('q');
var lastFmApiRequestHandler = require('./ApiRequestHandler');
var types = require('./../Types/Types');

var getTopTracks = function(artistName, limit){
    let defer = q.defer();
    lastFmApiRequestHandler.getTopTracks(artistName, limit).then((tracks) => {
        let track = tracks.track;
        let artist = new types.Artist();
        artist.setName(artistName);
        artist.setTracks(track).then(() => {
            defer.resolve(artist);
        }).catch((err) => {
            defer.reject(err);
        });

    }).catch((err) => {
        defer.reject(err);
    });

    return defer.promise;
};

module.exports = {
    getTopTracks: getTopTracks
};